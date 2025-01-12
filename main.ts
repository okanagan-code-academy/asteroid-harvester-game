namespace SpriteSheet{
    export let playerImage: Image = assets.image`playerShip`
}
namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 320
    export const ARCADE_SCREEN_HEIGHT = 240
}


let playerSprite: Sprite = sprites.create(SpriteSheet.playerImage);
sprites.setDataNumber(playerSprite, "currentAngle", Math.PI)
sprites.setDataNumber(playerSprite, "desiredAngle", 0)
let previousAction: string = "none"


function turnLeft() {
    smoothRotate(playerSprite, - Math.PI / 2, 100)
    pause(10)

}
function turnRight(){
    smoothRotate(playerSprite, Math.PI / 2, 100)
    pause(10)
}
function shoot(){
    let projectile:Sprite = sprites.create(assets.image`bullet`, SpriteKind.Projectile)
    projectile.setPosition(playerSprite.x, playerSprite.y)
    let direction: number = spriteutils.heading(playerSprite)
    projectile.z = -1
    spriteutils.setVelocityAtAngle(projectile, direction, 125)
    pause(500)
}


turnRight()
turnLeft()
turnLeft()
shoot()
shoot()
shoot()

function smoothRotate(sprite: Sprite, rotationAngle: number, stepsize: number): void {
    previousAction = "move"
    let currentAngle: number = sprites.readDataNumber(sprite, "currentAngle")
    let desiredAngle: number = currentAngle + rotationAngle
    sprites.setDataNumber(playerSprite, "desiredAngle", desiredAngle)
    let rotationRate: number = 0.1 * Math.sin(rotationAngle) / stepsize

    for(let step = 0; step < stepsize; step++){
        let interpolatedValue: number = lerp(sprites.readDataNumber(playerSprite, "currentAngle"), sprites.readDataNumber(playerSprite, "desiredAngle"), step*(1/stepsize))
        sprites.setDataNumber(playerSprite, "currentAngle", interpolatedValue)
        playerSprite.setImage(SpriteSheet.playerImage)
        rotsprite.rotSprite(playerSprite, sprites.readDataNumber(playerSprite, "currentAngle"))
        pause(10)
    }
}




function lerp(value0: number, value1: number, t: number): number {
    return value0 + t * (value1 - value0);
}