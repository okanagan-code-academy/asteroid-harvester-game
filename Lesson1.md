```customts
namespace SpriteSheet {
    export let playerImage: Image = assets.image`playerShip`
    export let bulletImage: Image = assets.image`bullet`
    export let targetLocationImage: Image = assets.image`location`
    export let enemyImage: Image = assets.image`enemyShip`
    export let mineImage: Image = assets.image`mine`
    export let wallImage: Image = assets.image`wall`
    export let cargoImage: Image = assets.image`cargo`
    export let winImage: Image = assets.image`win`

    export let mineDetonateAnimation: Image[] = [
        assets.image`mineFlash0`,
        assets.image`mineFlash1`,
        assets.image`mineFlash0`,
        assets.image`mineFlash1`,
        assets.image`mineFlash0`,
        assets.image`mineFlash1`,
    ]
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
    export let dustExplosionAnimation: Image[] = [
        sprites.projectile.firework2,
        sprites.projectile.firework1,
        sprites.projectile.laser4,
    ]

    export let explosionAnimation: Image[] = [
        sprites.projectile.explosion1,
        sprites.projectile.explosion2,
        sprites.projectile.explosion3,
        sprites.projectile.explosion4,
    ]
    export let playerExplosionAnimation: Image[] = [
        sprites.projectile.drop3,
        sprites.projectile.drop4,
        sprites.projectile.drop5,
    ]
    export let debrisImages: Image[] = [
        assets.image`particle1`,
        assets.image`particle2`,
        assets.image`particle3`,
    ]
    export let cargoAnimation: Image[] = [
        assets.image`cargo0`,
        assets.image`cargo1`,
        assets.image`cargo2`,
        assets.image`cargo3`,
        assets.image`cargo`,
        assets.image`cargo`,
        assets.image`cargo`,
        assets.image`cargo`,
        assets.image`cargo2`,
        assets.image`cargo1`,
        assets.image`cargo0`,
        assets.image`cargo0`,
        assets.image`cargo0`,
    ]
    export let winIndicator: Image[] = [
        assets.image`win2`,
        assets.image`win1`,
        assets.image`win4`,
        assets.image`win5`,
        assets.image`win4`,
        assets.image`win1`,
    ]

}
namespace SpriteKind {
    export const Location = SpriteKind.create()
    export const Splash = SpriteKind.create()
    export const Explosion = SpriteKind.create()
    export const Asteroid = SpriteKind.create()
    export const PlayerExplosion = SpriteKind.create()
    export const Particle = SpriteKind.create()
    export const Mine = SpriteKind.create()
    export const Barrier = SpriteKind.create()
    export const Cargo = SpriteKind.create()
    export const WinLocation = SpriteKind.create()
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
    dot(vector1: Vector2): number {
        return this.x * vector1.x + this.y * vector1.y
    }
}
namespace GridLayout {
    export class Level {
        layout: number[][]
        constructor(layout: number[][]) {
            this.layout = layout
        }
    }
    export class Wall {
        position: Vector2
        length: number
        vertical: boolean
        image: Image = SpriteSheet.wallImage

        constructor(position: Vector2, length: number, vertical: boolean) {
            this.position = position
            this.length = length
            this.vertical = vertical
        }
        createSprite(): Sprite {
            let wallSprite: Sprite = sprites.create(this.image, SpriteKind.Barrier)
            if (this.vertical) {
                wallSprite.setImage(this.image)
                rotsprite.rotSprite(wallSprite, Math.PI / 2)
                wallSprite.sx = this.length
            } else {
                wallSprite.sy = this.length
            }
            wallSprite.setPosition(this.position.x, this.position.y)
            return wallSprite
        }

    }
    export let allLevels: Level[] = [
        /* 
        ** The following provides insights into how levels are generated
        ** Assumptions:
        ** - There can only ever be 1 playerSprite
        ** - The player must be able to reach all nodes that are on the gridSprite
        ** - The mines destroy valid grid locations
        **
        ** -1 indicates the playerShip
        ** 0 indicates no objects spawning at the location
        ** 1 indicates an Asteroid
        ** 2 indicates an Enemy SpaceShip
        ** 3 indicates a Mine (and makes the grid location invalid)
        */
        new Level(
            [
                [0, 1, 0, 0, 1],
                [0, -1, 0, 1, 2],
                [0, 1, 3, 0, 0],
                [3, 0, 2, 3, 1],
                [2, 0, 1, 4, 1],
            ]
        ),
    ]
    export let levelWalls: Wall[][] = [
        [],
        [new Wall(new Vector2(70, 155), 30, false)]
    ]


}

namespace Events {
    /* Make sure to make the playerSprite variable null, otherwise the weird things can happen...
    ** - Example: The playerSprite could still shoot after it has been destroyed AND the game was over...
    */
    sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite: Sprite, otherSprite: Sprite): void {
        destroyPlayer(sprite)
    })
    sprites.onOverlap(SpriteKind.Player, SpriteKind.Asteroid, function (sprite: Sprite, otherSprite: Sprite): void {
        destroyPlayer(sprite)
    })
    sprites.onOverlap(SpriteKind.Player, SpriteKind.Barrier, function (sprite: Sprite, otherSprite: Sprite): void {
        destroyPlayer(sprite)
    })
    sprites.onOverlap(SpriteKind.Player, SpriteKind.Location, function (sprite: Sprite, otherSprite: Sprite): void {
        sprites.setDataSprite(sprite, "locationSprite", otherSprite)
    })
    sprites.onOverlap(SpriteKind.Player, SpriteKind.WinLocation, function (sprite: Sprite, otherSprite: Sprite): void {
        pause(1000)
        if (sprites.allOfKind(SpriteKind.Cargo).length > 0) {
            createTextSprite("Collect all cargo!", 1500, 2, 2)
            pause(1500)
            destroyPlayer(sprite)
            otherSprite.setFlag(SpriteFlag.Ghost, true)
            return
        }
        game.gameOver(true)
    })
  
    sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite: Sprite, otherSprite: Sprite): void {
        sprite.destroy()
        otherSprite.destroy()
        let randomAmount: number = randint(5, 8)
        for (let i = 0; i < randomAmount; i++) {
            createDebris(sprite, otherSprite.scale)
        }
        scene.cameraShake(10, 500)
    })
    sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Asteroid, function (sprite: Sprite, otherSprite: Sprite): void {
        let randomAmount: number = randint(5, 8)
        for (let i = 0; i < randomAmount; i++) {
            createDebris(sprite, otherSprite.scale)
        }
        sprite.destroy()
        otherSprite.destroy()
        scene.cameraShake(10, 500)
    })
    sprites.onOverlap(SpriteKind.Mine, SpriteKind.Location, function (sprite: Sprite, otherSprite: Sprite): void {
        otherSprite.destroy()

        // must set all neighbouring location sprites to have a null location since we removed one
        for (let i = 0; i < targetDirections.length; i++) {
            let conjugateNeighbourIndex = (i + 2) % targetDirections.length
            let neighbourSprite: Sprite = sprites.readDataSprite(otherSprite, targetDirections[i])
            sprites.setDataSprite(neighbourSprite, targetDirections[conjugateNeighbourIndex], null)
        }
        otherSprite = null
        pause(500 + 200 * sprites.readDataNumber(sprite, "mineCount"))
        animation.runImageAnimation(sprite, SpriteSheet.mineDetonateAnimation, 75, true)
        animation.animationPresets(animation.shake)
        sprite.lifespan = 750

    })
    sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Barrier, function (sprite: Sprite, otherSprite: Sprite): void {
        sprite.destroy()
    })

    // onCreated
    sprites.onCreated(SpriteKind.Projectile, function (sprite: Sprite) {
        spriteutils.onSpriteUpdate(sprite, function (sprite: Sprite) {
            if (sprites.readDataString(sprite, "direction") == targetDirections[0] || sprites.readDataString(sprite, "direction") == targetDirections[2]) {
                if (spriteutils.distanceBetween(sprite, playerSprite) > (userconfig.ARCADE_SCREEN_WIDTH - 20) / maxColumns) {
                    sprite.destroy()
                    for (let asteroid of spriteutils.getSpritesWithin(SpriteKind.Asteroid, 15, sprite)) {
                        asteroid.destroy()
                        let randomAmount: number = randint(5, 8)
                        for (let i = 0; i < randomAmount; i++) {
                            createDebris(asteroid, asteroid.scale)
                        }
                    }
                } 
            } else if (spriteutils.distanceBetween(sprite, playerSprite) > userconfig.ARCADE_SCREEN_HEIGHT / maxRows) {
                sprite.destroy()
                for (let asteroid of spriteutils.getSpritesWithin(SpriteKind.Asteroid, 15, sprite)) {
                    asteroid.destroy()
                    let randomAmount: number = randint(5, 8)
                    for (let i = 0; i < randomAmount; i++) {
                        createDebris(asteroid, asteroid.scale)
                    }
                }
            }
        })
    })

    // onDestroyed
    sprites.onDestroyed(SpriteKind.Enemy, function (sprite: Sprite): void {
        createExplosionSprite(sprite, sprite.scale, SpriteSheet.explosionAnimation)
    })
    sprites.onDestroyed(SpriteKind.Asteroid, function (sprite: Sprite): void {
        createExplosionSprite(sprite, sprite.scale, SpriteSheet.explosionAnimation)
    })
    sprites.onDestroyed(SpriteKind.Mine, function (sprite: Sprite): void {
        createExplosionSprite(sprite, 2, SpriteSheet.explosionAnimation)
    })
    sprites.onDestroyed(SpriteKind.PlayerExplosion, function (sprite: Sprite): void {
        timer.after(200, function (): void {
            game.gameOver(false)
        })

    })
    sprites.onDestroyed(SpriteKind.Cargo, function (sprite: Sprite): void {
        createExplosionSprite(sprite, 1, SpriteSheet.dustExplosionAnimation)
    })

    // helper methods
    function destroyPlayer(player: Sprite): void {
        player.destroy()
        createPlayerExplosion(player, 4)
        scene.cameraShake(10, 500)
        playerSprite = null
    }
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
        debrisSprite.setVelocity(directionX * speed, directionY * speed)

        spriteutils.onSpriteUpdate(debrisSprite, function (sprite: Sprite): void {
            if (sprite.scale > 0.05) {
                sprite.scale += 0.0125
            } else {
                sprite.destroy()
            }
        })
    }
    function createExplosionSprite(sprite: Sprite, scale: number, animationTrack: Image[]): void {
        let intervalDuration: number = 50
        let explosionSprite: Sprite = sprites.create(sprites.projectile.explosion1, SpriteKind.Explosion)
        explosionSprite.scale = 2 * scale
        explosionSprite.setPosition(sprite.x, sprite.y)
        animation.runImageAnimation(explosionSprite, animationTrack, intervalDuration, false)
        explosionSprite.lifespan = animationTrack.length * intervalDuration + 1
        music.playSound(music.smallCrash.toString())

    }


}

music.setVolume(50)
let currentLevel: number = 0
let maxColumns: number = 5
let maxRows: number = 5
let gridSprites: Sprite[][] = []
let playerSprite: Sprite = null
let directionIndex: number = 0
let targetDirections: string[] = [
    "topNeighbour",
    "rightNeighbour",
    "bottomNeighbour",
    "leftNeighbour"
]

generateGrid(new Vector2(40, 20), maxRows, maxColumns)

pauseUntil(() => generateGameSprites(currentLevel) && generateWalls(currentLevel))


backgroundScroller(new Vector2(40, 0))

pauseUntil(() => sprites.allOfKind(SpriteKind.Mine).length == 0)
pause(1000)
// scene.setBackgroundImage(assets.image`overlay`)

function generateGrid(startingPosition: Vector2, maxColumns: number, maxRows: number): void {
    const spacingX: number = Math.floor((userconfig.ARCADE_SCREEN_WIDTH - 20) / maxColumns)
    const spacingY: number = Math.floor(userconfig.ARCADE_SCREEN_HEIGHT / maxRows)


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
    let maxRowIndex: number = gridSprites.length - 1
    let maxColumnIndex: number = gridSprites[0].length - 1

    for (let row of gridSprites) {
        let currentColumnIndex: number = 0

        for (let sprite of row) {
            let topNeighbour: Sprite = null
            let bottomNeighbour: Sprite = null
            let leftNeighbour: Sprite = null
            let rightNeighbour: Sprite = null

            if (currentRowIndex > 0) {
                topNeighbour = gridSprites[currentRowIndex - 1][currentColumnIndex]
            }
            if (currentRowIndex < maxRowIndex) {
                bottomNeighbour = gridSprites[currentRowIndex + 1][currentColumnIndex]
            }
            if (currentColumnIndex > 0) {
                leftNeighbour = gridSprites[currentRowIndex][currentColumnIndex - 1]
            }
            if (currentColumnIndex < maxColumnIndex) {
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
// This function makes the assumption that the levelLayout will only have a single -1 indicating the player's starting location
function generateGameSprites(currentlevel: number): boolean {
    let levelLayout: number[][] = GridLayout.allLevels[currentlevel].layout

    for (let row = 0; row < levelLayout.length; row++) {
        for (let column = 0; column < levelLayout[row].length; column++) {
            let sprite: Sprite = gridSprites[row][column]
            if (levelLayout[row][column] == -1) {
                createPlayerSprite(sprite)
            } else if (levelLayout[row][column] == 1) {
                createAsteroidSprite(sprite)
            } else if (levelLayout[row][column] == 2) {
                createCargoSprite(sprite)
            } else if (levelLayout[row][column] == 3) {
                createMineSprite(sprite)
            } else if (levelLayout[row][column] == 4) {
                createWinSprite(sprite)
            }
        }
    }
    return true
}
function createPlayerSprite(sprite: Sprite): void {
    playerSprite = sprites.create(SpriteSheet.playerImage, SpriteKind.Player);
    sprites.setDataImage(playerSprite, "spriteImage", SpriteSheet.playerImage)
    sprites.setDataNumber(playerSprite, "currentAngle", 0)
    sprites.setDataNumber(playerSprite, "desiredAngle", 0)
    playerSprite.setPosition(sprite.x, sprite.y)
}
function createAsteroidSprite(sprite: Sprite): void {
    let randomImage: Image = SpriteSheet.asteroidImages._pickRandom()

    let asteroidSprite: Sprite = sprites.create(randomImage, SpriteKind.Asteroid)
    asteroidSprite.scale = Math.randomRange(1.4, 2.4)
    let time: number = Math.randomRange(0, 2 * Math.PI)
    let delta: number = Math.randomRange(0.0125, 0.1)
    let maxAmplitude: number = 6.0

    asteroidSprite.setPosition(sprite.x, sprite.y + maxAmplitude * Math.sin(time))
    game.onUpdate(function (): void {
        time = (time + delta) % (2 * Math.PI)
        asteroidSprite.y = sprite.y + maxAmplitude * Math.sin(time)
    })
}
function createCargoSprite(sprite: Sprite): void {
    let cargoSprite: Sprite = sprites.create(SpriteSheet.cargoImage, SpriteKind.Cargo)
    cargoSprite.scale = 1
    let time: number = Math.randomRange(0, 2 * Math.PI)
    let delta: number = Math.randomRange(0.06, 0.25)
    let maxAmplitude: number = 0.5
    cargoSprite.setPosition(sprite.x, sprite.y + maxAmplitude * Math.sin(time))
    animation.runImageAnimation(cargoSprite, SpriteSheet.cargoAnimation, 100, true)

    game.onUpdate(function (): void {
        time = (time + delta) % (2 * Math.PI)
        cargoSprite.y += maxAmplitude * Math.sin(time)
    })
}
function createMineSprite(sprite: Sprite): void {
    let mineSprite: Sprite = sprites.create(SpriteSheet.mineImage, SpriteKind.Mine)
    mineSprite.scale = 4
    mineSprite.setPosition(sprite.x, sprite.y)
    sprites.setDataNumber(mineSprite, "mineCount", sprites.allOfKind(SpriteKind.Mine).length)
}
function createWinSprite(sprite: Sprite): void {
    let winSprite: Sprite = sprites.create(SpriteSheet.winImage, SpriteKind.WinLocation)
    SpriteSheet.winIndicator.reverse()
    animation.runImageAnimation(winSprite, SpriteSheet.winIndicator, 100, true)
    winSprite.scale = 2
    winSprite.z = 2
    winSprite.setPosition(sprite.x, sprite.y)
}
function generateWalls(currentlevel: number): boolean {
    let levelWalls: GridLayout.Wall[] = GridLayout.levelWalls[currentLevel]

    for (let wall of levelWalls) {
        wall.createSprite()
    }
    return true
}
let scrollRate: Vector2 = Vector2.ZERO()


// player actions

// function turnLeft(): void {
//     if (!playerSprite) {
//         return
//     }
//     smoothRotate(playerSprite, - Math.PI / 2, 50)
//     directionIndex -= 1
//     if (directionIndex < 0) {
//         directionIndex += targetDirections.length
//     }
//     pause(100)
// }

function turnLeft(): void {
    turnRight()
    turnRight()
    turnRight()
}
function turnRight(): void {
    if (!playerSprite) {
        return
    }
    smoothRotate(playerSprite, Math.PI / 2, 50)
    directionIndex += 1
    directionIndex = directionIndex % targetDirections.length
    pause(10)

}
function shoot(): void {
    if (!playerSprite) {
        return
    }
    pause(100)
    let projectile: Sprite = sprites.create(SpriteSheet.bulletImage, SpriteKind.Projectile)
    // projectile.setFlag(SpriteFlag.Ghost, true)
    // timer.after(30, function(): void {
    //     projectile.setFlag(SpriteFlag.Ghost, false)
    // })
    projectile.setPosition(playerSprite.x, playerSprite.y)
    sprites.setDataString(projectile, "direction", targetDirections[directionIndex])
    let direction: number = sprites.readDataNumber(playerSprite, "currentAngle") - Math.PI / 2
    projectile.z = -1
    spriteutils.setVelocityAtAngle(projectile, direction, 125)
    music.playSound(music.pewPew.toString())
    pause(500)
}
function move(): void {
    if (!playerSprite) {
        return
    }
    pause(100)
    let currentLocationSprite: Sprite = sprites.readDataSprite(playerSprite, "locationSprite")
    let neighbourSprite: Sprite = sprites.readDataSprite(currentLocationSprite, targetDirections[directionIndex])
    // playerSprite.sayText(targetDirections[directionIndex], 2000)
    if (neighbourSprite) {
        smoothTranslate(playerSprite, neighbourSprite, 750)
    } else {
        createTextSprite("Invalid Direction", 1000, 2, 2)
    }
    pause(200)
}
function collectCargo(): void {
    if (!playerSprite) {
        return
    }
    pause(100)
    let cargoCollected: boolean = false
    for (let cargoSprite of spriteutils.getSpritesWithin(SpriteKind.Cargo, 10, playerSprite)) {
        cargoSprite.destroy()
        music.playSound(music.baDing.toString())
        cargoCollected = true
        break
    }
    if (!cargoCollected) {
        createTextSprite("No Cargo Found", 1000, 2, 2)
    } else {
        createTextSprite(sprites.allOfKind(SpriteKind.Cargo).length.toString() + " Cargo Remaining", 1000, 2, 7)
    }
    pause(200)
}

// helper methods
function createTextSprite(message: string, duration: number, scale: number, foregroundColor: number): void {
    let textSprite: Sprite = textsprite.create(message, 15, foregroundColor)
    textSprite.scale = scale
    textSprite.lifespan = duration
    textSprite.setPosition(scene.screenWidth() / 2, scene.screenHeight() / 2)
    textSprite.z = 1000
}
function smoothRotate(sprite: Sprite, rotationAngle: number, stepsize: number): void {
    if (!sprite) {
        return
    }
    let currentAngle: number = sprites.readDataNumber(sprite, "currentAngle")
    let desiredAngle: number = currentAngle + rotationAngle
    sprites.setDataNumber(sprite, "desiredAngle", desiredAngle)
    let rotationRate: number = 0.1 * Math.sin(rotationAngle) / stepsize

    for (let step = 0; step < stepsize; step++) {
        let interpolatedValue: number = lerp(sprites.readDataNumber(sprite, "currentAngle"), sprites.readDataNumber(sprite, "desiredAngle"), step * (1 / stepsize))
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
    scroller.setLayerImage(0, assets.image`spaceBackground`)
    scroller.setLayerImage(2, assets.image`spaceBackground2`)
    scroller.scrollBackgroundWithSpeed(-rate.x, -rate.y, 2)
    scroller.scrollBackgroundWithSpeed(-rate.x / 5, -rate.y / 5, 0)
}
function lerp(value0: number, value1: number, t: number): number {
    return value0 + t * (value1 - value0);
}


// Example Code
// shoot() - shoots 1 space in the direction the ship is facing
// move() - move 1 space in the direction the ship is facing
// turnRight() - rotates right
// turnLeft() - rotates left (rotating right 3 times)
// collectCargo() - collects the cargo provided there is one at the space your actions

```
# Lesson1
