# Architecture — Editeur de graphes

![TypeScript](https://img.shields.io/badge/TypeScript-typed-3178C6?style=flat&logo=typescript&logoColor=white)

## Introduction

Ce projet est un éditeur de graphes qui se veut modulaire grâce au câblage de nouveaux algorithmes sans toucher le code centralisé d'édition de graphes. Il est ainsi possible de créer un graphe manuellement et de lancer un algorithme dessus.
Le projet est en construction, pour le moment le noeud de départ est calculé en fonction de son nombre d'arêtes associées.
Pour avoir une arrête bidirectionnelle, il s'agit de créer l'arête aller et l'arête retour.

Le graphe s'enregistre dans la session du navigateur.

## Démo

🔗 <a href="https://graph-app-kappa.vercel.app/" target="_blank">Voir la démo en ligne</a>

![Démonstration de l'éditeur de graphes](./src/assets/graph.gif)

## Qualité de code :

![Code Health](https://img.shields.io/badge/code%20health-9.91%20%2F%2010-1D9E75?style=flat&logo=data:image/svg+xml;base64,...)

CodeScene :

## ![Codescene](./src/assets/code_scene.png)

## Architecture MVVM

### Module

Point d'entrée de chaque fonctionnalité. Il enregistre les actions disponibles et câble tous les composants ensemble (`install`). C'est l' endroit où les dépendances et les actions sont assemblées.

```
GraphModule
  ├── ArrowModule
  └── NodeModule
```

### ViewModel

Contient la logique métier. Il lit et mute le modèle, puis dispatche des événements sur l'event bus créé à base de CustomEvents injectés dans EventTarget natif de javascript. Il ne touche jamais le DOM.

### Handler

Réagit aux actions utilisateur (clics, node dragging). Il appelle le ViewModel et ne touche pas le DOM directement.

### DomBuilder

Responsable des mutations DOM, il écoute l'event bus et met à jour l'affichage.

### View

Orchestre les trois précédents. Elle instancie, câble, et ne stocke rien d'autre que ce dont le Module a besoin après construction.

---

## Le bus d'événements

Toutes les couches communiquent via un event bus partagé (`CustomEvents extends EventTarget`). Il n'y a pas de communication directe.

```
ViewModel  →  dispatch("node:position:update")
                        ↓
DomBuilder ←  addEventListener("node:position:update")
```

Les modules existants reçoivent `CustomEvents` en paramètre — ils acceptent donc `AlgorithmEvents` sans modification.

---

## Le FigureRegistry

Registre statique qui mappe des identifiants d'actions à des handlers. Les ids sont des identifiants de **catégorie** (`node_events`, `arrow_events`) associé à l'identifiant de l'instance de graphe auquel le bouton et son action associée doivent se rattacher.

---

## MVVM plutôt que MVC

Il est difficile de scinder les évènements des éléments dom avec une structure MVC, on arrive rapidement à un modèle hybride et difficilement maintenable. Plus adapté si on veut rajouter des fonctionnalités liées aux évènementx si on ne veut pas mélanger logique associée aux évènements dom et affichage des éléments.

---

## Ajouter un algorithme

1. Créer un `NouveauModule implements Module`
2. Utiliser `AlgorithmEvents extends CustomEvents` pour les nouveaux événements
3. Dispatcher sur le bus
4. Regarder la structure

```
GraphAlgorithmModule
  ├── BFSModule
  └── VotreNouveauModule
```

## Justifications des choix techniques :

- J'ai choisi d'utiliser un bus d'évènements plutôt qu'un store pour trigger et dispactcher les évènements DOM car un store gère l'état interne de l'app. Le store mute les valeurs alors que le bus génère juste un évènement de reaction, le store aurait mélangé les responsabilités et le code également par conséquent.

- J'ai choisi un découplage modulaire pour ne pas à avoir à toucher à la logique de création et d'édition de graphe lorsque je rajoute des algorithmes, l'objectif c'est de pouvoir rajouter plein de modules sans toucher à la logique centralisée.

- Mon prochain chantier de travail sera de finir de découpler totalement la logique dom de la logique des view model notamment pour que ce soit testable plus facilement, que les doms builders ne connaissent pas du tout les models même si ils ont besoin d'afficher les informations contenues dans les instances.
# Extensibilité — architecture d'extension

Le projet est conçu pour qu'on puisse brancher de nouveaux algorithmes sans toucher au code principal d'édition de graphes. Le socle qui le permet existe déjà :

- `Module.install(bus, container)` comme point d'entrée unique
- le `FigureRegistry`, qui permet à un module d'avoir ses propres boutons et actions de menu
- un bus (`CustomEvents extends EventTarget`) sur lequel un module peut émettre ses propres événements custom sans que le bus ait à être modifié.

Ce qui manquait, c'était un moyen pour un module d'attacher **ses propres données** au graphe. Un BFS se contente de lire la structure. Un Ford-Fulkerson a besoin de capacités sur les arêtes, un Dijkstra de poids — donc de persister des informations que le cœur ne connaît pas.

---

## Ce que j'ai écarté, et pourquoi

**Faire hériter `Arrow`.** Les instances sont créées par `Graph.create_arrow()` en dur, donc un module ne peut pas faire produire ses propres types par le tracé utilisateur. Et surtout, `Storage` sérialise en JSON : `create_loaded_arrow()` reconstruit des `Arrow` nus au rechargement. Le prototype est perdu à l'aller-retour JSON, et les capacités disparaîtraient silencieusement.

**Faire hériter `Graph`.** Même impasse, un cran plus haut : `main.ts` fait `new Graph()` en dur et passe l'instance à `App`, aux modules et à `Storage`. Un module reçoit le graphe, il ne le crée pas — il ne peut donc pas décider de sa classe car impossible de modifier une classe déjà créée sans passer par une modification en dur du code.

**Une clé localStorage séparée par module.** Bloqué par `main.ts`, qui traite chaque clé du localStorage comme un graphe distinct et instancie une `App` par clé.

---

## Voici mes choix stratégiques

Un emplacement générique dans la classe graphe pour les données propres aux modules (capacités, poids) :

```ts
module_data: Record<string, unknown> = {};
```

Chaque extension range ses données sous sa propre clé, avec un numéro de version pour permettre une migration à la lecture.

```ts
module_data = {
  type: "flow",
  flow:     { version: 1, capacities: { /* arrow.id → capacité */ } },
  weighted: { version: 1, weights:    { /* arrow.id → poids */ } },
}
```

`module_data` est recopié dans `Graph.init()` — c'est le seul point du cœur qui bouge, et il ne mentionne aucun module. Sans cette ligne, les données seraient bien présentes dans le JSON stocké mais n'atteindraient jamais l'instance reconstruite au rechargement.

### Le type décrit le graphe, pas le module

`module_data.type` décrit la **nature du graphe** plutôt que le module actif :

| Type | Algorithmes | Donnée portée |
|---|---|---|
| `plain` | BFS, DFS | aucune |
| `weighted` | Dijkstra | poids par arête |
| `flow` | Ford-Fulkerson, Edmonds-Karp | capacité et flux par arête |

Deux algorithmes partageant un type cohabitent sans se gêner. Un module déclare le type dont il a besoin ; la règle de compatibilité se compare entre types, jamais entre noms d'algorithme.

### Les blocs coexistent

Basculer de Ford-Fulkerson à Dijkstra ne touche **ni aux nœuds ni aux arêtes** : seul le `type` change. Les capacités sont retrouvées telles quelles, puisque les blocs de types différents ne s'écrasent pas.

Cette conservation rend d'ailleurs inutile la règle de destruction prévue au départ — le `type` ne sert plus qu'à savoir quel type de graphe est en cours de création / édition.

### Objets parallèles plutôt qu'héritage

Le module maintient ses propres objets à côté des `Arrow` de l'éditeur, indexés par le même `id`, synchronisés via `draw:arrow` et `remove:arrow`. Le cœur ignore son existence.

Aucune instanciation à intercepter, aucun problème de sérialisation, et l'éditeur n'a pas à connaître ses extensions.

---

## Ajouter un algorithme

1. Créer un `NouveauModule implements Module`
2. Déclarer son type de graphe requis (`plain`, `weighted`, `flow`, ou un nouveau)
3. Lire et écrire ses données sous sa clé dans `graph.module_data`
4. Émettre ses propres événements sur le bus
5. Enregistrer ses boutons via `FigureRegistry.register` (un algorithme est un module)

---

## Limites connues

- **`AlgorithmModule` liste les modules en dur.** Ajouter un algorithme demanderait une ligne dans ce fichier. L'idée d'un bootstrap de chargement avec une commande bash pourrait avoir du sens dans un environnement adapté.
- **`Module` n'a pas de `uninstall()`.** Nécessaire dès qu'on bascule entre modules : retrait des écouteurs du bus, du calque SVG, des classes CSS posées sur les nœuds.
- **`ArrowDomBuilder.draw()` repose le style en dur** (`stroke`, `stroke-width`) à chaque redessin. Un module qui veut recolorier les arêtes doit passer par son propre calque SVG, ou il faut basculer le style en classes CSS.
- **Les entrées orphelines ne sont pas nettoyées.** Une arête supprimée pendant qu'un autre type est actif laisse sa capacité dans le bloc ; à filtrer au chargement. Voir à créer un `CustomModuleDataEventBus` pour gérer ce cas.
- **`BFSLogic` n'est pas réutilisable comme brique.** La traversée et son animation sont la même fonction, et elle ne retourne rien — Edmonds-Karp devra réimplémenter son propre BFS au lieu de composer avec l'existant. Je vais donc travailler sur la séparation des responsabilités de cette fonction en amont.
- Ecrire des tests

