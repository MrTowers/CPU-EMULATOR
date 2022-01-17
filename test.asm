define gpu 0x200
define i 0x1000

loop:
    ila 1
    ldb i
    sto gpu
    add
    sta i
    lda i
    ilb 1024
    beq end
    jmp loop

end:
    brk