namespace SpriteKind {
    export const GreenShell = SpriteKind.create()
    export const Coin = SpriteKind.create()
    export const RedShell = SpriteKind.create()
    export const HeadsUpDisplay = SpriteKind.create()
    export const KillerShell = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (PlayerControl == true) {
        if (editMode == false) {
            selecting = false
            HUD.setImage(assets.image`BoxEmpty`)
            if (Inventory == 1) {
                Shell = sprites.create(assets.image`shell`, SpriteKind.GreenShell)
                animation.runImageAnimation(
                Shell,
                assets.animation`GreenShell`,
                100,
                true
                )
                Shell.setBounceOnWall(true)
                Shell.scale = 0.2
                Shell.setPosition(Mrro.x, Mrro.y)
                spriteutils.setVelocityAtAngle(Shell, spriteutils.degreesToRadians(direction), 200)
                timer.after(500, function () {
                    Shell.setKind(SpriteKind.KillerShell)
                })
            } else if (Inventory == 2) {
                Shell = sprites.create(assets.image`shellRed`, SpriteKind.RedShell)
                animation.runImageAnimation(
                Shell,
                assets.animation`RedShell`,
                100,
                true
                )
                Shell.scale = 0.2
                Shell.setPosition(Mrro.x, Mrro.y)
                spriteutils.setVelocityAtAngle(Shell, spriteutils.degreesToRadians(direction), 200)
                tempVar2 = randint(1, 3)
                if (tempVar2 == 1) {
                    sprites.setDataSprite(Shell, "ShellTarget", Mrro)
                } else if (tempVar2 == 2) {
                    sprites.setDataSprite(Shell, "ShellTarget", Sanic)
                } else if (tempVar2 == 3) {
                    sprites.setDataSprite(Shell, "ShellTarget", Kyrbo)
                }
                timer.after(1000, function () {
                    Shell.setKind(SpriteKind.KillerShell)
                    Shell.follow(sprites.readDataSprite(Shell, "ShellTarget"), 200)
                })
            } else if (Inventory == 3) {
                Shroom = sprites.create(assets.image`Shroom`, SpriteKind.Food)
                Shroom.scale = 0.1
                Shroom.setPosition(Mrro.x, Mrro.y)
                spriteutils.setVelocityAtAngle(Shroom, spriteutils.degreesToRadians(direction), speed)
                speedCap = 300
                speed = 300
                Boosting = true
                timer.after(500, function () {
                    sprites.destroy(Shroom)
                    timer.after(1000, function () {
                        Boosting = false
                    })
                })
                Render.jump(Shroom, 60)
            } else if (Inventory == 4) {
                Feather = sprites.create(assets.image`Feather`, SpriteKind.Food)
                Feather.scale = 0.1
                Feather.setPosition(Mrro.x, Mrro.y)
                spriteutils.setVelocityAtAngle(Feather, spriteutils.degreesToRadians(direction), speed)
                Render.jump(Feather, 60)
                timer.after(500, function () {
                    sprites.destroy(Feather)
                    Render.jump(Mrro, 80)
                    Render.jump(PlayerCamera, 80)
                })
            } else {
                Render.jump(Mrro, 20)
            }
            Inventory = 0
        }
        if (editMode == true) {
            console.log(Mrro.x)
            console.log(Mrro.y)
            console.log("-----------")
        }
    }
})
scene.onHitWall(SpriteKind.GreenShell, function (sprite, location) {
    bumps += 1
})
function Start () {
    for (let enemies of sprites.allOfKind(SpriteKind.Enemy)) {
        sprites.setDataNumber(enemies, "DestinationIndex", 0)
        AImoves(enemies)
    }
}
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.x += -2
    otherSprite.x += 2
})
sprites.onOverlap(SpriteKind.KillerShell, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    spriteutils.setVelocityAtAngle(otherSprite, 0, 0)
    timer.after(500, function () {
        AImoves(otherSprite)
    })
})
function debug () {
    for (let waypoint of LVLwaypoints) {
        tempSprite = sprites.create(assets.image`Jerry_orange`, SpriteKind.HeadsUpDisplay)
        tempSprite.setPosition(waypoint[0], waypoint[1])
        tempSprite.setFlag(SpriteFlag.ShowPhysics, true)
    }
}
function AImoves (enemy: Sprite) {
    sprites.setDataNumber(enemy, "EnemyX", LVLwaypoints[sprites.readDataNumber(enemy, "DestinationIndex")][0] + randint(-5, 5))
    sprites.setDataNumber(enemy, "EnemyY", LVLwaypoints[sprites.readDataNumber(enemy, "DestinationIndex")][1] + randint(-5, 5))
    spriteutils.moveToAtSpeed(enemy, spriteutils.point(sprites.readDataNumber(enemy, "EnemyX"), sprites.readDataNumber(enemy, "EnemyY")), randint(100, 140))
}
sprites.onOverlap(SpriteKind.KillerShell, SpriteKind.Player, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    speed = 0
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile5`, function (sprite, location) {
    if (selecting == false) {
        selecting = true
        tiles.setTileAt(location, assets.tile`myTile7`)
        Render.jump(sprite, 20)
        animation.runImageAnimation(
        HUD,
        assets.animation`Change`,
        100,
        true
        )
        timer.after(2000, function () {
            Inventory = randint(1, 4)
            animation.stopAnimation(animation.AnimationTypes.All, HUD)
            if (Inventory == 1) {
                HUD.setImage(assets.image`BoxGreen`)
            } else if (Inventory == 2) {
                HUD.setImage(assets.image`BoxRed`)
            } else if (Inventory == 3) {
                HUD.setImage(assets.image`BoxShroom`)
            } else if (Inventory == 4) {
                HUD.setImage(assets.image`BoxFeather`)
            }
        })
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    spriteutils.setVelocityAtAngle(sprite, direction + 90, speed / 2)
})
let CrossingFinish = false
let tempVar = 0
let slide = 0
let tempSprite: Sprite = null
let bumps = 0
let Feather: Sprite = null
let Boosting = false
let Shroom: Sprite = null
let Shell: Sprite = null
let enemyControl = false
let PlayerControl = false
let tempVar2 = 0
let CoinSprite: Sprite = null
let HUD: Sprite = null
let Kyrbo: Sprite = null
let Sanic: Sprite = null
let Mrro: Sprite = null
let PlayerCamera: Sprite = null
let LVLwaypoints: number[][] = []
let editMode = false
let Inventory = 0
let speedCap = 0
let selecting = false
let speed = 0
let direction = 0
namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 400
    export const ARCADE_SCREEN_HEIGHT = 300
}
direction = 0
speed = 0
selecting = false
speedCap = 120
Inventory = 4
let Placement = 1
editMode = false
LVLwaypoints = [
[330, 40],
[400, 70],
[450, 110],
[455, 130],
[455, 285],
[430, 385],
[360, 420],
[260, 290],
[200, 360],
[110, 370],
[65, 210],
[60, 80],
[120, 40],
[210, 40]
]
if (editMode) {
    debug()
    Render.setViewMode(ViewMode.tilemapView)
} else {
    Render.setViewMode(ViewMode.raycastingView)
}
tiles.setCurrentTilemap(tilemap`level`)
PlayerCamera = Render.getRenderSpriteVariable()
PlayerCamera.setFlag(SpriteFlag.Ghost, true)
Render.setAttribute(Render.attribute.wallZScale, 1)
Render.moveWithController(0, 0, 0)
Mrro = sprites.create(assets.image`MrroBack`, SpriteKind.Player)
Sanic = sprites.create(assets.image`SanicBack`, SpriteKind.Enemy)
Kyrbo = sprites.create(assets.image`KyrboBack`, SpriteKind.Enemy)
HUD = sprites.create(assets.image`BoxEmpty`, SpriteKind.HeadsUpDisplay)
HUD.setFlag(SpriteFlag.Ghost, true)
Mrro.scale = 0.12
Sanic.scale = 0.12
Kyrbo.scale = 0.12
HUD.scale = 0.12
sprites.setDataNumber(Mrro, "LapsFinished", 0)
sprites.setDataNumber(Sanic, "LapsFinished", 0)
sprites.setDataNumber(Kyrbo, "LapsFinished", 0)
for (let CoinStuff of tiles.getTilesByType(assets.tile`myTile4`)) {
    CoinSprite = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Coin)
    animation.runImageAnimation(
    CoinSprite,
    assets.animation`Coin`,
    50,
    true
    )
    CoinSprite.scale = 0.25
    tiles.placeOnTile(CoinSprite, CoinStuff)
    tiles.setTileAt(CoinStuff, assets.tile`myTile1`)
}
for (let SetupCoordinates of tiles.getTilesByType(assets.tile`myTile8`)) {
    tiles.setTileAt(SetupCoordinates, assets.tile`myTile0`)
    tempVar2 = randint(1, 3)
    if (tempVar2 == 1) {
        tiles.placeOnTile(Mrro, SetupCoordinates)
        Mrro.x += -16
        Mrro.y += -4
        tiles.placeOnTile(Sanic, SetupCoordinates)
        Sanic.x += -16
        Sanic.y += 4
        tiles.placeOnTile(Kyrbo, SetupCoordinates)
        Kyrbo.x += -24
        Kyrbo.y += -4
    } else if (tempVar2 == 2) {
        tiles.placeOnTile(Sanic, SetupCoordinates)
        Sanic.x += -16
        Sanic.y += -4
        tiles.placeOnTile(Kyrbo, SetupCoordinates)
        Kyrbo.x += -16
        Kyrbo.y += 4
        tiles.placeOnTile(Mrro, SetupCoordinates)
        Mrro.x += -24
        Mrro.y += -4
    } else if (tempVar2 == 3) {
        tiles.placeOnTile(Kyrbo, SetupCoordinates)
        Kyrbo.x += -16
        Kyrbo.y += -4
        tiles.placeOnTile(Mrro, SetupCoordinates)
        Mrro.x += -16
        Mrro.y += 4
        tiles.placeOnTile(Sanic, SetupCoordinates)
        Sanic.x += -24
        Sanic.y += -4
    }
}
spriteutils.placeAngleFrom(
PlayerCamera,
spriteutils.degreesToRadians(direction),
-13,
Mrro
)
spriteutils.placeAngleFrom(
HUD,
spriteutils.degreesToRadians(direction + 50),
5,
Mrro
)
Render.setViewAngleInDegree(direction)
Mrro.setFlag(SpriteFlag.Ghost, false)
Sanic.setFlag(SpriteFlag.Ghost, false)
Mrro.setFlag(SpriteFlag.ShowPhysics, true)
Sanic.setFlag(SpriteFlag.ShowPhysics, false)
sprites.setDataNumber(Mrro, "DestinationIndex", -1)
Render.setSpriteAttribute(HUD, RCSpriteAttribute.ZPosition, 3000)
timer.after(1000, function () {
    music.play(music.stringPlayable("E - - - E - - - ", 120), music.PlaybackMode.UntilDone)
    music.play(music.stringPlayable("A - - - - - - - ", 120), music.PlaybackMode.InBackground)
    PlayerControl = true
    enemyControl = true
    Start()
})
game.onUpdate(function () {
    if (PlayerControl == true) {
        if (controller.A.isPressed()) {
            speed += 2
        } else {
            speed += speed * -0.05
        }
        if (speed > 2 || Render.getSpriteAttribute(Mrro, RCSpriteAttribute.ZVelocity) > 0) {
            if (controller.left.isPressed()) {
                Mrro.setImage(assets.image`MrroLeft`)
                direction += -2
            } else if (controller.right.isPressed()) {
                Mrro.setImage(assets.image`MrroRight`)
                direction += 2
            } else {
                Mrro.setImage(assets.image`MrroBack`)
            }
        }
        if (speed > speedCap) {
            speed = speedCap
        }
        spriteutils.placeAngleFrom(
        PlayerCamera,
        spriteutils.degreesToRadians(direction),
        -13,
        Mrro
        )
        spriteutils.placeAngleFrom(
        HUD,
        spriteutils.degreesToRadians(direction + 50),
        5,
        Mrro
        )
        Render.setViewAngleInDegree(direction)
        if (spriteutils.degreesToRadians(direction + slide) > Math.PI * 2) {
            spriteutils.setVelocityAtAngle(Mrro, 0, speed)
        } else if (spriteutils.degreesToRadians(direction + slide) < 0) {
            spriteutils.setVelocityAtAngle(Mrro, Math.PI * 2, speed)
        } else {
            spriteutils.setVelocityAtAngle(Mrro, spriteutils.degreesToRadians(direction + slide), speed)
        }
        if (speed > speedCap - 15 && controller.right.isPressed()) {
            tempVar = speedCap - 15
            slide = (speed - tempVar) / 15 * 15 * -1
        } else if (speed > speedCap - 15 && controller.left.isPressed()) {
            tempVar = speedCap - 15
            slide = (speed - tempVar) / 15 * 15
        } else {
            tempVar = 0
            slide = 0
        }
    } else {
        spriteutils.setVelocityAtAngle(Mrro, spriteutils.degreesToRadians(direction), speed)
        speed += speed * -0.05
        Render.setViewAngleInDegree(spriteutils.heading(Mrro))
    }
    if (Boosting == false) {
        if (!(PlayerCamera.tileKindAt(TileDirection.Center, assets.tile`myTile6`))) {
            speedCap = 120
        } else {
            speedCap = 60
        }
    }
    if (Mrro.tileKindAt(TileDirection.Center, assets.tile`myTile0`) && CrossingFinish == false) {
        CrossingFinish = true
        timer.background(function () {
            pauseUntil(() => CrossingFinish == false)
            sprites.changeDataNumberBy(Mrro, "LapsFinished", 1)
        })
    } else {
        if (!(Mrro.tileKindAt(TileDirection.Center, assets.tile`myTile0`))) {
            CrossingFinish = false
            if (sprites.readDataNumber(Mrro, "LapsFinished") > 5) {
                PlayerControl = false
            }
        }
    }
    if (direction > 360) {
        direction = 0
    } else if (direction < 0) {
        direction = 360
    }
    for (let enemies2 of sprites.allOfKind(SpriteKind.Enemy)) {
        if (enemyControl == true) {
            if (enemies2.x >= sprites.readDataNumber(enemies2, "EnemyX") - 2 && enemies2.x <= sprites.readDataNumber(enemies2, "EnemyX") + 2 && (enemies2.y >= sprites.readDataNumber(enemies2, "EnemyY") - 2 && enemies2.y <= sprites.readDataNumber(enemies2, "EnemyY") + 2)) {
                sprites.changeDataNumberBy(enemies2, "DestinationIndex", 1)
                if (sprites.readDataNumber(enemies2, "DestinationIndex") > LVLwaypoints.length - 1 && sprites.readDataNumber(enemies2, "LapsFinished") < 4) {
                    console.log("hi")
                    sprites.setDataNumber(enemies2, "DestinationIndex", 0)
                    sprites.changeDataNumberBy(enemies2, "LapsFinished", 1)
                } else if (sprites.readDataNumber(enemies2, "DestinationIndex") > LVLwaypoints.length - 2 && sprites.readDataNumber(enemies2, "LapsFinished") > 4) {
                    console.log("bye")
                    enemyControl = false
                    sprites.setDataNumber(enemies2, "DestinationIndex", LVLwaypoints.length - 1)
                }
                AImoves(enemies2)
                if (sprites.readDataNumber(enemies2, "DestinationIndex") == LVLwaypoints.length - 2) {
                    sprites.setDataBoolean(enemies2, "canCrossFinish", true)
                }
            }
        } else if (enemyControl == false && sprites.readDataNumber(enemies2, "LapsFinished") > 4) {
        	
        } else {
        	
        }
    }
})
