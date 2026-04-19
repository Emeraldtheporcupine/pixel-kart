namespace SpriteKind {
    export const GreenShell = SpriteKind.create()
    export const Coin = SpriteKind.create()
    export const RedShell = SpriteKind.create()
    export const HeadsUpDisplay = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (deBug == false) {
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
    if (deBug == true) {
        console.log(Mrro.x)
        console.log(Mrro.y)
        console.log("-----------")
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
scene.onOverlapTile(SpriteKind.Enemy, assets.tile`myTile0`, function (sprite, location) {
    timer.background(function () {
        pauseUntil(() => CrossingFinish == false)
        sprites.changeDataNumberBy(sprite, "LapsFinished", 1)
    })
})
function AImoves (enemy: Sprite) {
    sprites.setDataNumber(enemy, "EnemyX", LVLwaypoints[sprites.readDataNumber(enemy, "DestinationIndex")][0])
    sprites.setDataNumber(enemy, "EnemyY", LVLwaypoints[sprites.readDataNumber(enemy, "DestinationIndex")][1])
    spriteutils.moveToAtSpeed(enemy, spriteutils.point(sprites.readDataNumber(enemy, "EnemyX"), sprites.readDataNumber(enemy, "EnemyY")), randint(100, 140))
}
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
let slide = 0
let tempVar = 0
let bumps = 0
let Feather: Sprite = null
let Boosting = false
let Shroom: Sprite = null
let Shell: Sprite = null
let enemyControl = false
let PlayerControl = false
let CoinSprite: Sprite = null
let HUD: Sprite = null
let Mrro: Sprite = null
let PlayerCamera: Sprite = null
let LVLwaypoints: number[][] = []
let deBug = false
let Inventory = 0
let speedCap = 0
let selecting = false
let CrossingFinish = false
let speed = 0
let direction = 0
namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 400
    export const ARCADE_SCREEN_HEIGHT = 300
}
direction = 0
speed = 0
CrossingFinish = false
selecting = false
speedCap = 120
Inventory = 4
let Placement = 1
deBug = false
LVLwaypoints = [
[330, 40],
[400, 70],
[450, 110],
[455, 130],
[455, 285],
[440, 410],
[400, 450],
[360, 420],
[260, 290],
[210, 340],
[180, 370],
[150, 395],
[65, 210],
[40, 90],
[60, 80],
[120, 40],
[180, 40]
]
Render.setViewMode(ViewMode.raycastingView)
tiles.setCurrentTilemap(tilemap`level`)
PlayerCamera = Render.getRenderSpriteVariable()
PlayerCamera.setFlag(SpriteFlag.Ghost, true)
Render.setAttribute(Render.attribute.wallZScale, 1)
Mrro = sprites.create(assets.image`MrroBack`, SpriteKind.Player)
let Lrrgi = sprites.create(assets.image`LrrgiBack`, SpriteKind.Enemy)
let Pinch = sprites.create(assets.image`PinchBack`, SpriteKind.Enemy)
HUD = sprites.create(assets.image`BoxEmpty`, SpriteKind.HeadsUpDisplay)
HUD.setFlag(SpriteFlag.Ghost, true)
Mrro.scale = 0.12
Lrrgi.scale = 0.12
Pinch.scale = 0.12
HUD.scale = 0.12
tiles.placeOnTile(Mrro, tiles.getTileLocation(10, 2))
tiles.placeOnTile(Lrrgi, tiles.getTileLocation(10, 3))
tiles.placeOnTile(Pinch, tiles.getTileLocation(10, 1))
sprites.setDataNumber(Mrro, "LapsFinished", 0)
sprites.setDataNumber(Lrrgi, "LapsFinished", 0)
sprites.setDataNumber(Pinch, "LapsFinished", 0)
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
Mrro.setFlag(SpriteFlag.Ghost, false)
Lrrgi.setFlag(SpriteFlag.Ghost, false)
Mrro.setFlag(SpriteFlag.ShowPhysics, false)
Lrrgi.setFlag(SpriteFlag.ShowPhysics, false)
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
        CrossingFinish = false
    }
    if (direction > 360) {
        direction = 0
    } else if (direction < 0) {
        direction = 360
    }
    if (speed > speedCap - 30 && controller.right.isPressed()) {
        tempVar = speedCap - 30
        slide = (speed - tempVar) / 30 * 30 * -1
    } else if (speed > speedCap - 30 && controller.left.isPressed()) {
        tempVar = speedCap - 30
        slide = (speed - tempVar) / 30 * 30
    } else {
        tempVar = 0
        slide = 0
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
    for (let enemies2 of sprites.allOfKind(SpriteKind.Enemy)) {
        if (enemyControl == true) {
            if (enemies2.x >= sprites.readDataNumber(enemies2, "EnemyX") - 2 && enemies2.x <= sprites.readDataNumber(enemies2, "EnemyX") + 2 && (enemies2.y >= sprites.readDataNumber(enemies2, "EnemyY") - 2 && enemies2.y <= sprites.readDataNumber(enemies2, "EnemyY") + 2)) {
                sprites.changeDataNumberBy(enemies2, "DestinationIndex", 1)
                if (sprites.readDataNumber(enemies2, "DestinationIndex") > LVLwaypoints.length - 1) {
                    sprites.setDataNumber(enemies2, "DestinationIndex", 0)
                }
                AImoves(enemies2)
            }
        } else {
        	
        }
    }
})
