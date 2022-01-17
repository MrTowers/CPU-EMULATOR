define player1.health 0x1000
define player1.pos 0x1001
define player2.health 0x1002
define player2.pos 0x1003

define ball.pos.x 0x1004
define ball.pos.y 0x1005
define ball.velocity.x 0x1006
define ball.velocity.y 0x1007

define random 0xfe
define input 0xff

init:
    ila 3
    sta player1.health
    sta player2.health
    
levelStart:
    jsr ball.set
    jmp loop
    brk
    
loop:
    jsr players.update
    jmp loop
    
players.update:
    lda input
    ilb 68
    beq player1.up
    ilb 66
    beq player1.down
    ilb 64
    beq player2.up
    ilb 62
    beq player2.down
    rts
    
    player1.up:
        lda player1.pos
        ilb 1
        add
        sta player1.pos
        rts
    player1.down:
        lda player1.pos
        ilb 0xff
        add
        sta player1.pos
        rts
    player2.up:
        lda player2.pos
        ilb 1
        add
        sta player2.pos
        rts
    player2.down:
        lda player2.pos
        ilb 0xff
        add
        sta player2.pos
        rts
    
ball.set:
    ila 0xff
    ilb 2
    div
    sta ball.pos.x
    sta ball.pos.y
    lda random
    ilb 127
    brl ball.set.left
    jmp ball.set.right
    
    ball.set.left:
        ila 0x1
        sta ball.velocity.x
        rts
    
    ball.set.right:
        ila 0xff
        sta ball.velocity.x
        rts
    