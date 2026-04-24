# Architecture — Editeur de graphes

## Introduction

Ce projet est un éditeur de graphes qui se veut modulaire grâce au câblage de nouveaux algorithmes sans toucher le code centralisé d'édition de graphes. Il est ainsi possible de créer un graphe manuellement et de lancer un algorithme dessus.
Le projet est en construction, pour le moment le noeud de départ est calculé en fonction de son nombre d'arêtes associées.
Pour avoir une arrête bidirectionnelle, il s'agit de créer l'arête aller et l'arête retour.

Le graphe s'enregistre dans la session du navigateur.

---

## Architecture MVVM

### Module

Point d'entrée de chaque fonctionnalité. Il enregistre les actions disponibles (`register`) et câble tous les composants ensemble (`install`). C'est le seul endroit où les dépendances sont assemblées.

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

Responsable des mutations DOM, il écoute l'event bus et met à jour l'affichage en conséquence.

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

Registre statique qui mappe des identifiants d'actions à des handlers. Les ids sont des identifiants de **catégorie** (`node_events`, `arrow_events`), pas d'instances DOM lié à l'instance.

---

## MVVM plutôt que MVC

Il est difficile de scinder les évènements des éléments dom avec une structure MVC, on arrive rapidement à un modèle hybride et difficilement maintenable.

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

## Limitations actuelles vouées à modications futures

Par manque de temps la gestion des boutons n'est pas optimale. C'est le point faible du projet et cette thématique fera l'objet d'une refacto très prochainement

Pareil pour le button singleton

Gérer mieux l'ordre d'inialisation dans App

Ecrire des tests
