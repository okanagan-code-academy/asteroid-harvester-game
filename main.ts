namespace SpriteSheet{
    export let playerImage: Image =assets.image`playerShip`
    export let bulletImage: Image = assets.image`bullet`
    export let targeLocation: Image = assets.image`location`

    export let asteroidImages: Image[] = [
        sprites.space.spaceSmallAsteroid0,
        sprites.space.spaceSmallAsteroid1,
        sprites.space.spaceSmallAsteroid2,
        sprites.space.spaceSmallAsteroid3,
        sprites.space.spaceSmallAsteroid4,
        sprites.space.spaceSmallAsteroid5,
        sprites.space.spaceAsteroid0,
        sprites.space.spaceAsteroid1,
        sprites.space.spaceAsteroid2,
        sprites.space.spaceAsteroid3,
        sprites.space.spaceAsteroid4,
    ]
    export let splashAnimation : Image[] = [
        sprites.projectile.firework1,
        sprites.projectile.firework2,
        sprites.projectile.firework3,
        sprites.projectile.firework4,
        sprites.projectile.firework5,

    ]
    export let explosionAnimation : Image [] = [
        sprites.projectile.explosion1,
        sprites.projectile.explosion2,
        sprites.projectile.explosion3,
        sprites.projectile.explosion4,
    ]
}
namespace SpriteKind {
    export const Location = SpriteKind.create()
    export const Splash = SpriteKind.create()
    export const Explosion = SpriteKind.create()
}
namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 320
    export const ARCADE_SCREEN_HEIGHT = 240
}
namespace overlaps {
    sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite) : void {
        sprite.destroy()
        otherSprite.destroy()
    })
    sprites.onDestroyed(SpriteKind.Projectile, function(sprite: Sprite) : void {
        createSplashSprite(sprite)
    })
    sprites.onDestroyed(SpriteKind.Enemy, function(sprite : Sprite) : void {
        createExplosionSprite(sprite, sprite.scale)
    })

    function createSplashSprite(sprite : Sprite) : void {
        let intervalDuration: number = 10
        let splashSprite : Sprite = sprites.create(sprites.projectile.firework1, SpriteKind.Splash)
        splashSprite.scale = 0.5
        splashSprite.setPosition(sprite.x, sprite.y)
        animation.runImageAnimation(splashSprite, SpriteSheet.splashAnimation, intervalDuration, false)
        splashSprite.lifespan = SpriteSheet.splashAnimation.length * intervalDuration + 1
    }
    function createExplosionSprite(sprite : Sprite, scale: number) : void {
        let intervalDuration : number = 20
        let explosionSprite : Sprite = sprites.create(sprites.projectile.explosion1, SpriteKind.Explosion)
        explosionSprite.scale = scale + 0.2
        explosionSprite.setPosition(sprite.x, sprite.y)
        animation.runImageAnimation(explosionSprite, SpriteSheet.explosionAnimation, intervalDuration, false)
        explosionSprite.lifespan = SpriteSheet.explosionAnimation.length * intervalDuration + 1

    }
    sprites.onOverlap(SpriteKind.Player, SpriteKind.Location, function(sprite : Sprite, otherSprite : Sprite) : void {
        sprites.setDataSprite(sprite, "locationSprite", otherSprite)
    })
}
class Vector2 {
    x: number = 0
    y: number = 0

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
    static ONE() {
        return new Vector2(1, 1)
    }
    static ZERO() {
        return new Vector2(0, 0)
    }
    length(): number {
        let vector: Vector2 = Vector2.ZERO()
        return spriteutils.distanceBetween(this, vector)
    }
    add(vector2 : Vector2): Vector2 {
        return new Vector2(this.x + vector2.x, this.y + vector2.y)
    }
    subtract(vector2 : Vector2) : Vector2 {
        return new Vector2(vector2.x - this.x, vector2.y - this.y)
    }
    normalize() : Vector2 {
        let length: number = this.length()
        return new Vector2(this.x / length, this.y / length)
    }
    scale(scalar: number): Vector2 {
        return new Vector2(scalar * this.x, scalar * this.y)
    }
    lerp(vector1 : Vector2, t : number): Vector2 {
        let resultVector: Vector2 = Vector2.ZERO()
        resultVector.x = lerp(this.x, vector1.x, t)
        resultVector.y = lerp(this.y, vector1.y, t)
        return resultVector
    }
}

let gridSprites: Sprite[][] = []
generateGrid(new Vector2(40, 20), 5, 5)
let playerSprite: Sprite = sprites.create(SpriteSheet.playerImage, SpriteKind.Player);
sprites.setDataNumber(playerSprite, "currentAngle", 0)
sprites.setDataNumber(playerSprite, "desiredAngle", 0)
let directionIndex : number = 0
let targetDirections : string[] = [
    "topNeighbour",
    "rightNeighbour",
    "bottomNeighbour",
    "leftNeighbour"
]




playerSprite.setPosition(40, 210)
backgroundScroller(new Vector2(40, 0))
// generateAsteroids(new Vector2(40, 20), 5, 5)
scene.setBackgroundImage(assets.image`overlay`)

function generateGrid(startingPosition : Vector2, maxColumns : number, maxRows : number) : void {
    const spacingX: number = Math.floor(300 / maxColumns)
    const spacingY: number = Math.floor(240 / maxRows)


    for (let row = 0; row < maxRows; row++) {
        gridSprites[row] = []
        for (let column = 0; column < maxColumns; column++) {
            let gridSprite: Sprite = sprites.create(SpriteSheet.targeLocation, SpriteKind.Location)
            gridSprite.z = -1
            let newPosition: Vector2 = startingPosition.add(new Vector2(column * spacingX, row * spacingY))
            gridSprite.setPosition(newPosition.x, newPosition.y)
            gridSprites[row].push(gridSprite)
        }
    }
    let currentRowIndex : number = 0
    let maxRowIndex : number = gridSprites.length-1
    let maxColumnIndex : number = gridSprites[0].length-1

    for(let row of gridSprites) {
        let currentColumnIndex: number = 0
        
        for(let sprite of row) {
            let topNeighbour: Sprite = null
            let bottomNeighbour: Sprite = null
            let leftNeighbour: Sprite = null
            let rightNeighbour: Sprite = null

            if(currentRowIndex > 0) {
                topNeighbour = gridSprites[currentRowIndex - 1][currentColumnIndex]
            }
            if(currentRowIndex < maxRowIndex) {
                bottomNeighbour = gridSprites[currentRowIndex + 1][currentColumnIndex]
            }
            if(currentColumnIndex > 0){
                leftNeighbour = gridSprites[currentRowIndex][currentColumnIndex - 1]
            }
            if(currentColumnIndex < maxColumnIndex) {
                rightNeighbour = gridSprites[currentRowIndex][currentColumnIndex + 1]
            }
            sprites.setDataSprite(sprite, "topNeighbour", topNeighbour)
            sprites.setDataSprite(sprite, "bottomNeighbour", bottomNeighbour)
            sprites.setDataSprite(sprite, "leftNeighbour", leftNeighbour)
            sprites.setDataSprite(sprite, "rightNeighbour", rightNeighbour)
            currentColumnIndex += 1
        }
        currentRowIndex += 1
    }
}
function generateAsteroids(startingPosition : Vector2, maxColumns: number, maxRows : number) : void {
    const spacingX : number = Math.floor(300 / maxColumns)
    const spacingY : number = Math.floor(240 / maxRows)


    for (let column = 0; column < maxColumns; column++) {
        for(let row = 0; row < maxRows; row++) {
            let randomImage: Image = SpriteSheet.asteroidImages._pickRandom()

            let asteroidSprite: Sprite = sprites.create(randomImage, SpriteKind.Enemy)
            sprites.setDataImage(asteroidSprite, "spriteImage", randomImage)
            sprites.setDataNumber(asteroidSprite, "angle", Math.randomRange(-Math.PI, Math.PI))
            sprites.setDataNumber(asteroidSprite, "rotationRate", Math.randomRange(-Math.PI / 24, Math.PI / 24))

            let newPosition: Vector2 = startingPosition.add(new Vector2(column * spacingX, row * spacingY))
            asteroidSprite.setPosition(newPosition.x, newPosition.y)

            spriteutils.onSpriteUpdate(asteroidSprite, function(sprite : Sprite) : void {
                let currentAngle : number = sprites.readDataNumber(sprite, "angle")
                currentAngle += sprites.readDataNumber(sprite, "rotationRate")
                sprites.setDataNumber(sprite, "angle", currentAngle)
                sprite.setImage(sprites.readDataImage(sprite, "spriteImage"))
                rotsprite.rotSprite(sprite, sprites.readDataNumber(sprite, "angle"))
            })
        }
        

    }
}



let currentPosition : Vector2 = Vector2.ZERO()
let scrollRate: Vector2 = Vector2.ZERO()

function turnLeft() : void{
    smoothRotate(playerSprite, - Math.PI / 2, 100)
    directionIndex -= 1
    if(directionIndex < 0){
        directionIndex += targetDirections.length
    }
    pause(10)

}
function turnRight() : void{
    smoothRotate(playerSprite, Math.PI / 2, 100)
    directionIndex += 1
    directionIndex = directionIndex % targetDirections.length
    pause(10)
}
function shoot() : void{
    let projectile:Sprite = sprites.create(SpriteSheet.bulletImage, SpriteKind.Projectile)
    projectile.setPosition(playerSprite.x, playerSprite.y)
    let direction: number = sprites.readDataNumber(playerSprite, "currentAngle") - Math.PI / 2
    projectile.z = -1
    spriteutils.setVelocityAtAngle(projectile, direction, 125)
    pause(500)
}
function moveForward() : void {
    let currentLocationSprite : Sprite = sprites.readDataSprite(playerSprite, "locationSprite")
    let neighbourSprite: Sprite = sprites.readDataSprite(currentLocationSprite, targetDirections[directionIndex])
    playerSprite.sayText(targetDirections[directionIndex], 2000)
    if(neighbourSprite){
        smoothTranslate(playerSprite, neighbourSprite, 750)
    } else {
        playerSprite.sayText("Invalid direction", 2000)
        pause(2000)
    }
    
}

turnRight()
moveForward()
turnRight()
moveForward()
turnRight()
moveForward()
turnRight()
moveForward()



function smoothRotate(sprite: Sprite, rotationAngle: number, stepsize: number) : void {
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

function smoothTranslate(sprite: Sprite, target : Sprite, stepsize: number) : void {
    spriteutils.moveTo(playerSprite, target, 750, true)

}

function backgroundScroller(rate: Vector2) : void {
    scroller.setLayerImage(0,assets.image`spaceBackground`)
    scroller.setLayerImage(1,assets.image`spaceBackground1`)
    scroller.setLayerImage(2,assets.image`spaceBackground2`)
    scroller.scrollBackgroundWithSpeed(-rate.x, -rate.y, 2)
    scroller.scrollBackgroundWithSpeed(-rate.x / 2, -rate.y / 2, 1)
    scroller.scrollBackgroundWithSpeed(-rate.x / 5, -rate.y / 5, 0)
}

function lerp(value0: number, value1: number, t: number): number {
    return value0 + t * (value1 - value0);
}