namespace SpriteSheet{
    export let playerImage: Image =assets.image`playerShip`
    export let bulletImage: Image = assets.image`bullet`
    export let targetLocationImage: Image = assets.image`location`
    export let enemyImage: Image =assets.image`enemyShip`

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

    export let explosionAnimation: Image [] = [
        sprites.projectile.explosion1,
        sprites.projectile.explosion2,
        sprites.projectile.explosion3,
        sprites.projectile.explosion4,
    ]
    export let playerExplosionAnimation: Image [] = [
        sprites.projectile.drop3,
        sprites.projectile.drop4,
        sprites.projectile.drop5,
    ]
    export let debrisImages: Image [] = [
        assets.image`particle1`,
        assets.image`particle2`,
        assets.image`particle3`,
    ]
}
namespace SpriteKind {
    export const Location = SpriteKind.create()
    export const Splash = SpriteKind.create()
    export const Explosion = SpriteKind.create()
    export const Asteroid = SpriteKind.create()
    export const PlayerExplosion = SpriteKind.create()
    export const Particle = SpriteKind.create()
}
namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 320
    export const ARCADE_SCREEN_HEIGHT = 240
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
    add(vector2: Vector2): Vector2 {
        return new Vector2(this.x + vector2.x, this.y + vector2.y)
    }
    subtract(vector2: Vector2): Vector2 {
        return new Vector2(vector2.x - this.x, vector2.y - this.y)
    }
    normalize(): Vector2 {
        let length: number = this.length()
        return new Vector2(this.x / length, this.y / length)
    }
    scale(scalar: number): Vector2 {
        return new Vector2(scalar * this.x, scalar * this.y)
    }
    lerp(vector1: Vector2, t: number): Vector2 {
        let resultVector: Vector2 = Vector2.ZERO()
        resultVector.x = lerp(this.x, vector1.x, t)
        resultVector.y = lerp(this.y, vector1.y, t)
        return resultVector
    }
}
namespace gridLayout {
    export let level1 = {
        "layout": [
            [0, 1, 0, 0, 1],
            [0, -1, 0, 1, 2],
            [0, 1, 0, 0, 0],
            [0, 0, 2, 0, 1],
            [2, 0, 1, 0, 1],
        ],
        "spawnLocation": new Vector2(1, 1)
    }
}

namespace overlaps {
    /* Make sure to make the playerSprite variable null, otherwise the weird things can happen...
    ** - Example: The playerSprite could still shoot after it has been destroyed AND the game was over...
    */
    sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite): void {
        sprite.destroy()
        createPlayerExplosion(otherSprite, 4)
        scene.cameraShake(10, 500)
        playerSprite = null
    })
    sprites.onOverlap(SpriteKind.Player, SpriteKind.Asteroid, function (sprite: Sprite, otherSprite: Sprite): void {
        sprite.destroy()
        createPlayerExplosion(otherSprite, 4)
        scene.cameraShake(10, 500)
        playerSprite = null
    })
    sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite): void {
        sprite.destroy()
        otherSprite.destroy()
        let randomAmount: number = randint(10, 20)
        for (let i = 0; i < randomAmount; i++) {
            createDebris(sprite, otherSprite.scale)
        }
        scene.cameraShake(10, 500)
    })
    sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Asteroid, function (sprite: Sprite, otherSprite: Sprite): void {
        let randomAmount: number = randint(10, 20)
        for (let i = 0; i < randomAmount; i++) {
            createDebris(sprite, otherSprite.scale)
        }
        sprite.destroy()
        otherSprite.destroy()
        scene.cameraShake(10, 500)
    })
    sprites.onDestroyed(SpriteKind.Enemy, function(sprite: Sprite): void {
        createExplosionSprite(sprite, sprite.scale)
    })
    sprites.onDestroyed(SpriteKind.Asteroid, function (sprite: Sprite): void {
        createExplosionSprite(sprite, sprite.scale)
    })
    sprites.onDestroyed(SpriteKind.Player, function(sprite: Sprite): void {
        
    })
    sprites.onDestroyed(SpriteKind.PlayerExplosion, function(sprite: Sprite): void {
        game.setGameOverEffect(false, effects.none)
        game.gameOver(false)
    })
    function createPlayerExplosion(targetSprite: Sprite, scale: number): void {
        let duration: number = 200
        let explosionSprite: Sprite = sprites.create(SpriteSheet.playerImage, SpriteKind.PlayerExplosion)
        explosionSprite.setPosition(targetSprite.x + (explosionSprite.width), targetSprite.y + (explosionSprite.height / 6))
        explosionSprite.scale = scale
        animation.runImageAnimation(explosionSprite, SpriteSheet.playerExplosionAnimation, duration, false)
        explosionSprite.lifespan = duration * SpriteSheet.playerExplosionAnimation.length + 1
        music.playSound(music.bigCrash.toString())
    }

    function createDebris(targetSprite: Sprite, maxScale: number): void {
        let directionX: number = randint(-1, 1)
        let directionY: number = randint(-1, 1)
        let speed: number = randint(100, 175)
        let debrisSprite: Sprite = sprites.create(SpriteSheet.debrisImages._pickRandom(), SpriteKind.Particle)
        spriteutils.placeAngleFrom(debrisSprite, 0, 0, targetSprite)
        debrisSprite.lifespan = 1000
        debrisSprite.scale = Math.randomRange(0.2, (maxScale - 0.5))
        // debrisSprite.setFlag(SpriteFlag.Ghost, true)
        debrisSprite.setVelocity(directionX*speed, directionY*speed)

        spriteutils.onSpriteUpdate(debrisSprite, function(sprite: Sprite): void {
            if(sprite.scale > 0.05){
                sprite.scale += 0.0125
            } else {
                sprite.destroy()
            }
        })
    }
    function createExplosionSprite(sprite: Sprite, scale: number): void {
        let intervalDuration: number = 50
        let explosionSprite: Sprite = sprites.create(sprites.projectile.explosion1, SpriteKind.Explosion)
        explosionSprite.scale = 2*scale
        explosionSprite.setPosition(sprite.x, sprite.y)
        animation.runImageAnimation(explosionSprite, SpriteSheet.explosionAnimation, intervalDuration, false)
        explosionSprite.lifespan = SpriteSheet.explosionAnimation.length * intervalDuration + 1
        // music.playSound(music.smallCrash.toString())

    }
    sprites.onOverlap(SpriteKind.Player, SpriteKind.Location, function(sprite: Sprite, otherSprite: Sprite): void {
        sprites.setDataSprite(sprite, "locationSprite", otherSprite)
    })
}

music.setVolume(50)
let gridSprites: Sprite[][] = []
generateGrid(new Vector2(40, 20), 5, 5)
generateHazards()
let playerSprite: Sprite = sprites.create(SpriteSheet.playerImage, SpriteKind.Player);
sprites.setDataImage(playerSprite, "spriteImage", SpriteSheet.playerImage)
sprites.setDataNumber(playerSprite, "currentAngle", 0)
sprites.setDataNumber(playerSprite, "desiredAngle", 0)


let directionIndex: number = 0
let targetDirections: string[] = [
    "topNeighbour",
    "rightNeighbour",
    "bottomNeighbour",
    "leftNeighbour"
]

let spawnIndex: Vector2 = gridLayout.level1["spawnLocation"]
let spawnLocation: Sprite = gridSprites[spawnIndex.x][spawnIndex.y]

playerSprite.setPosition(spawnLocation.x, spawnLocation.y)
backgroundScroller(new Vector2(40, 0))

// scene.setBackgroundImage(assets.image`overlay`)

function generateGrid(startingPosition: Vector2, maxColumns: number, maxRows: number): void {
    const spacingX: number = Math.floor(300 / maxColumns)
    const spacingY: number = Math.floor(240 / maxRows)


    for (let row = 0; row < maxRows; row++) {
        gridSprites[row] = []
        for (let column = 0; column < maxColumns; column++) {
            let gridSprite: Sprite = sprites.create(SpriteSheet.targetLocationImage, SpriteKind.Location)
            gridSprite.z = -1
            let newPosition: Vector2 = startingPosition.add(new Vector2(column * spacingX, row * spacingY))
            gridSprite.setPosition(newPosition.x, newPosition.y)
            gridSprites[row].push(gridSprite)
        }
    }
    let currentRowIndex: number = 0
    let maxRowIndex: number = gridSprites.length-1
    let maxColumnIndex: number = gridSprites[0].length-1

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
function generateHazards(): void {

    for (let row = 0; row < gridLayout.level1["layout"].length; row++) {
        for(let column = 0; column < gridLayout.level1["layout"][row].length; column++) {
            let sprite: Sprite = gridSprites[row][column]
            
            if(gridLayout.level1["layout"][row][column] == 1){
                
                let randomImage: Image = SpriteSheet.asteroidImages._pickRandom()

                let asteroidSprite: Sprite = sprites.create(randomImage, SpriteKind.Asteroid)
                sprites.setDataImage(asteroidSprite, "spriteImage", randomImage)
                sprites.setDataNumber(asteroidSprite, "angle", Math.randomRange(-Math.PI, Math.PI))
                sprites.setDataNumber(asteroidSprite, "rotationRate", Math.randomRange(-Math.PI / 24, Math.PI / 24))

                asteroidSprite.setPosition(sprite.x, sprite.y)
                asteroidSprite.scale = Math.randomRange(1, 2.5)

                spriteutils.onSpriteUpdate(asteroidSprite, function (sprite: Sprite): void {
                    let currentAngle: number = sprites.readDataNumber(sprite, "angle")
                    currentAngle += sprites.readDataNumber(sprite, "rotationRate")
                    sprites.setDataNumber(sprite, "angle", currentAngle)
                    sprite.setImage(sprites.readDataImage(sprite, "spriteImage"))
                    rotsprite.rotSprite(sprite, sprites.readDataNumber(sprite, "angle"))
                })
            } else if (gridLayout.level1["layout"][row][column] == 2) {

                let enemySprite: Sprite = sprites.create(SpriteSheet.enemyImage, SpriteKind.Enemy)
                sprites.setDataImage(enemySprite, "spriteImage", SpriteSheet.enemyImage)
                sprites.setDataNumber(enemySprite, "currentAngle", 0)
                sprites.setDataNumber(enemySprite, "desiredAngle", 0)

                enemySprite.setPosition(sprite.x, sprite.y)
            }
            
        }
        
    }
}



let currentPosition: Vector2 = Vector2.ZERO()
let scrollRate: Vector2 = Vector2.ZERO()


function turnLeft(): void {
    smoothRotate(playerSprite, - Math.PI / 2, 100)
    directionIndex -= 1
    if(directionIndex < 0){
        directionIndex += targetDirections.length
    }
    pause(500)
}
function turnRight(): void{
    timer.background(function(): void {
        for (let sprite of sprites.allOfKind(SpriteKind.Enemy)) {
            timer.background(function (): void {
                smoothRotate(sprite, randint(-1, 1) * (Math.PI / 2), 100)
            })
        }
    })
    smoothRotate(playerSprite, Math.PI / 2, 100)
    directionIndex += 1
    directionIndex = directionIndex % targetDirections.length
    pause(500)
    
}
function shoot(): void{
    let projectile:Sprite = sprites.create(SpriteSheet.bulletImage, SpriteKind.Projectile)
    if(!playerSprite){
        return
    }
    projectile.setPosition(playerSprite.x, playerSprite.y)
    let direction: number = sprites.readDataNumber(playerSprite, "currentAngle") - Math.PI / 2
    projectile.z = -1
    spriteutils.setVelocityAtAngle(projectile, direction, 125)
    // music.playSound(music.pewPew.toString())
    pause(500)
}
function moveForward(): void {
    pause(100)
    let currentLocationSprite: Sprite = sprites.readDataSprite(playerSprite, "locationSprite")
    let neighbourSprite: Sprite = sprites.readDataSprite(currentLocationSprite, targetDirections[directionIndex])
    // playerSprite.sayText(targetDirections[directionIndex], 2000)
    if(neighbourSprite){
        smoothTranslate(playerSprite, neighbourSprite, 750)
        pause(750)
    } else {
        createTextSprite("Invalid Direction", 1000, 2)
       
    }
    pause(1000)
}

function createTextSprite(message: string, duration: number, scale: number): void {
    let textSprite: Sprite = textsprite.create(message, 15, 2)
    textSprite.scale = scale
    textSprite.lifespan = duration
    textSprite.setPosition(scene.screenWidth() / 2, scene.screenHeight() / 2)
    textSprite.z = 1000
}

turnRight()
moveForward()
moveForward()
shoot()
shoot()
turnRight()



function smoothRotate(sprite: Sprite, rotationAngle: number, stepsize: number): void {
    if(!sprite) {
        return
    }
    let currentAngle: number = sprites.readDataNumber(sprite, "currentAngle")
    let desiredAngle: number = currentAngle + rotationAngle
    sprites.setDataNumber(sprite, "desiredAngle", desiredAngle)
    let rotationRate: number = 0.1 * Math.sin(rotationAngle) / stepsize

    for(let step = 0; step < stepsize; step++){
        let interpolatedValue: number = lerp(sprites.readDataNumber(sprite, "currentAngle"), sprites.readDataNumber(sprite, "desiredAngle"), step*(1/stepsize))
        sprites.setDataNumber(sprite, "currentAngle", interpolatedValue)
        sprite.setImage(sprites.readDataImage(sprite, "spriteImage"))
        rotsprite.rotSprite(sprite, sprites.readDataNumber(sprite, "currentAngle"))
        pause(10)
    }
}

function smoothTranslate(sprite: Sprite, target: Sprite, stepsize: number): void {
    if (!sprite) {
        return
    }
    spriteutils.moveTo(sprite, target, 750, true)

}

function backgroundScroller(rate: Vector2): void {
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