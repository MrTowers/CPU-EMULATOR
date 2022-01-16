define input 0xff

loop:
    lda input
    ilb 87
    beq hit
    jmp loop

hit:
    ila 10
    cmd
    ila 0
    sta input
    jmp loop