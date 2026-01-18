# Scheduler - Task Planning Class

## Comment utiliser ?

```bash
# Installer les dépendances
npm install
```

```bash
# Lancer les tests
npm test
```

## Sujet

Individuellement ou en binôme, en adoptant une approche TDD, vous élaborez une classe déclenchant des tâches planifiées.

## ⚠️ Important

L'absence de commit git pour chacune des 3 étapes (RED, GREEN, REFACTOR) de la majorité des itérations TDD de l'atelier rendra l'atelier hors-sujet (oublis ponctuels tolérés).

## Objectif

Coder progressivement, test après test, une classe `Scheduler` qui gère l'exécution de tâches planifiées. Pour cela, cette classe possèdera **À TERME** les membres suivants :

- Un accesseur énumérant les tâches actuellement planifiées
- Une méthode de définition/modification (`setTask` dans l'exemple) d'une tâche planifiée caractérisée par :
  - Un nom
  - Une périodicité (voir plus bas)
  - Une interface ou une lambda donnée (fonction anonyme, callback, ...)
- Une méthode de suppression d'une tâche planifiée par son nom
- Une méthode d'activation périodique sans paramètre (`update` dans l'exemple) qui lance une par une les tâches qui doivent l'être à l'heure actuelle

## Exemple d'utilisation

> Note : `EveryDay` n'est pas forcément le meilleur moyen de définir une périodicité.

```ts
const sch = new Scheduler(new MySystemClock());

sch.setTask("backup", new EveryDayAt(3, 0), () => Obj.doBackup());

for (;;) {
  sch.update();
  Thread.sleep(1000);
}
```

## Périodicités à gérer

Choisir une par une les périodicités à gérer parmi la [syntaxe de la table cron](https://fr.wikipedia.org/wiki/Cron#Syntaxe_de_la_table) par ordre de difficulté croissante. Il est demandé d'en gérer autant que possible (mais pas forcément sous forme de chaîne de caractères).

## Approche TDD

### Cycle RED - GREEN - REFACTOR

1. **RED** : Écriture de tests → Lancement des tests → Les tests échouent
2. **GREEN** : Changement minimal du code → Lancement des tests → Tous les tests passent
3. **REFACTOR** : Remanier (DRY) → Lancement des tests →
    - Tests ou code KO → Remanier (DRY)...
    - Tests et code OK → Étape RED

## Tests et dépendances

Si votre implémentation l'exige, il est possible de coder des classes supplémentaires transformant certains tests unitaires en tests d'intégration.

En dehors de ces classes, afin de disposer de tests déterministes et génériques, les autres dépendances de `Scheduler` doivent, bien entendu, être simulées et notamment :

- Le temps
- L'interface/lambda
