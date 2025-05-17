
/** @type Phaser.Types.Core.PhysicsConfig */
export const physics  = {
    default: 'arcade',
    arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
    }
}

/** @type Phaser.Types.Core.FPSConfig */
export const fps = {
    min: 40,
    target: 60,
    limit: 60,
    smoothStep: false,
    forceSetTimeOut: false,
}

/** @type Phaser.Types.Core.DOMContainerConfig */
export const dom = {
    createContainer: true,
}

/** @type Phaser.Types.Core.ScaleConfig */
export const scale = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1600,
    height: 900,
}