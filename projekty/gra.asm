define input 0xff
define player.pos 0x1000
define player.score 0x1001
define gpu 0x200
define random 0xfe
define score.pos 0x1002

define w 87
define a 65
define s 83
define d 68

init:
    ila 0xff
    sta score.pos
    jsr player.draw
    jsr score.generate
    jmp loop

loop:
    jmp player.move
    brk

player.draw:
    ila 1
    ldb player.pos
    sto gpu
    rts

player.clear:
    ila 0
    ldb player.pos
    sto gpu
    rts

input.clear:
    ila 0
    sta input
    rts

score.generate:
    jsr player.score.up
    jsr score.clear
    jsr random.pos
    jsr score.draw
    rts

    random.pos:
        lda random
        sta score.pos
        rts

    score.clear:
        ila 0
        ldb score.pos
        sto gpu
        ila 5
        rts

    score.draw:
        ila 1
        ldb score.pos
        sto gpu
        rts

player.score.up:
    lda player.score
    ilb 1
    add
    cmd
    sta player.score
    rts

player.move:
    lda input
    ilb w
    beq player.move.up
    ilb a
    beq player.move.left
    ilb s
    beq player.move.down
    ilb d
    beq player.move.right
    jmp loop

    player.move.right:
        jsr checkPoint
        jsr player.clear
        ila 1
        ldb player.pos
        add
        sta player.pos
        jsr player.draw
        jsr input.clear
        jmp loop

    player.move.left:
        jsr checkPoint
        jsr player.clear
        ila -1
        ldb player.pos
        add
        sta player.pos
        jsr player.draw
        jsr input.clear
        jmp loop

    player.move.down:
        jsr checkPoint
        jsr player.clear
        ila 32
        ldb player.pos
        add
        sta player.pos
        jsr player.draw
        jsr input.clear
        jmp loop

    player.move.up:
        jsr checkPoint
        jsr player.clear
        ila -32
        ldb player.pos
        add
        sta player.pos
        jsr player.draw
        jsr input.clear
        jmp loop
    
    checkPoint:
        lda player.pos
        ldb score.pos
        beq pointEqual
        rts

        pointEqual:
            jsr score.generate
            rts