```package
pxt-arcade-rotsprite= github:chasemor/pxt-arcade-rotsprite#b5b91d0f67e4df90ec703c36875c30afffbe653c,
arcade-sprite-util= github:jwunderl/arcade-sprite-util#v0.4.1,
arcade-sprite-data= github:microsoft/arcade-sprite-data#v0.2.1,
pxt-tick-event= github:microsoft/pxt-tick-event#v0.2.0,
Timers= github:microsoft/arcade-timers#v1.1.0,
arcade-background-scroll= github:microsoft/arcade-background-scroll#v0.1.2,
arcade-text= github:microsoft/arcade-text#v1.3.0

```
Space Explorer
Introduction @unplugged

** Let's explore the depths of space! **

In this tutorial, you'll design a spaceship for your journey.

Set the scene

Give 'em something to look at 🔭

🔲 Drag the ||scene:start screen [confetti] effect ⊕|| from the ||scene:Scene|| category and into the ||loops:on start|| block that's already in the workspace.

🔲 Next, select ||scene:star field|| (instead of ||scene:confetti||) from the dropdown and watch as you blast into space! 🚀

// @highlight
effects.starField.startScreenEffect()

Draw your ship

🧑🏿‍🚀 Time to choose our ship! 👩🏾‍🚀

🔲 From the ||sprites:Sprites|| category, drag the ||variables:set [mySprite] to sprite [ ] of kind [Player]|| block and place it at the end of the ||loops:on start|| container.