namespace SpriteSheet{
    export let playerImage: Image = assets.image`playerShip`

}
//% promise

let playerSprite: Sprite = sprites.create(SpriteSheet.playerImage);
sprites.setDataNumber(playerSprite, "currentAngle", 0)
sprites.setDataNumber(playerSprite, "desiredAngle", 0)
let previousAction: string = "none"



async function turnLeft() {
    
    timer.throttle(previousAction, 500, function () {
        smoothRotate(playerSprite, - Math.PI / 2, 100)
    })
}
async function turnRight() {
    previousAction = "move"
    timer.throttle(previousAction, 500, () => smoothRotate(playerSprite, Math.PI / 2, 10))
}



turnRight()
turnRight()

function smoothRotate(sprite: Sprite, rotationAngle: number, stepsize: number): void {
    previousAction = "move"
    let currentAngle: number = sprites.readDataNumber(sprite, "currentAngle")
    let desiredAngle: number = currentAngle + rotationAngle
    sprites.setDataNumber(playerSprite, "desiredAngle", desiredAngle)
    let rotationRate: number = 0.1 * Math.sin(rotationAngle) / stepsize

    // for(let step = 0; step < stepsize; step++){
    //     let interpolatedValue: number = lerp(sprites.readDataNumber(playerSprite, "currentAngle"), sprites.readDataNumber(playerSprite, "desiredAngle"), step*(1/stepsize))
    //     sprites.setDataNumber(playerSprite, "currentAngle", interpolatedValue)
    //     playerSprite.setImage(SpriteSheet.playerImage)
    //     rotsprite.rotSprite(playerSprite, sprites.readDataNumber(playerSprite, "currentAngle"))
    //     pause(100)
    // }

    forever(function (): void {
        let currentAngle: number = sprites.readDataNumber(playerSprite, "currentAngle")
        let desiredAngle: number = sprites.readDataNumber(playerSprite, "desiredAngle")
        let interpolatedValue: number = lerp(sprites.readDataNumber(playerSprite, "currentAngle"), sprites.readDataNumber(playerSprite, "desiredAngle"), 0.125)
        sprites.setDataNumber(playerSprite, "currentAngle", interpolatedValue)
        playerSprite.setImage(SpriteSheet.playerImage)
        rotsprite.rotSprite(playerSprite, sprites.readDataNumber(playerSprite, "currentAngle"))
    })
}




function lerp(value0: number, value1: number, t: number): number {
    return value0 + t * (value1 - value0);
}