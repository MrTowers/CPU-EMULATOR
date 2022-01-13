define numberA 0x1
define numberB 0x2
define numberC 0x3
define interations 0x4


jmp init

init:
    ila 5
    sta numberA
    sta numberB
    jmp for

for:
    lda numberB
    sta interations
    jmp for2

for2:
    ldb numberC
    lda numberA
    add
    sta numberC
    lda interations
    ilb 1
    sub
    sta interations
    lda interations
    ilb 0
    beq end
    jmp for2

end:
    ila 5
    cmd
    brk