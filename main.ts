let mySprite: Sprite = sprites.create(sprites.duck.duck1);

let angle: number = 0;

controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    // At the moment have to reset the image because the algorithm is lossy
    mySprite.setImage(sprites.duck.duck1);
    angle += Math.PI / 12;
    rotsprite.rotSprite(mySprite, angle)
})

controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    // At the moment have to reset the image because the algorithm is lossy
    mySprite.setImage(sprites.duck.duck1);
    angle -= Math.PI / 12;
    rotsprite.rotSprite(mySprite, angle)
})

forever(function(){
    if(controller.left.isPressed()) {
        mySprite.setImage(sprites.duck.duck1);
        angle += Math.PI / 12;
        rotsprite.rotSprite(mySprite, angle)
    }
})