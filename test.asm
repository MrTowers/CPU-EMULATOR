define numberA 0x1
define numberB 0x2
define numberC 0x3
define interations 0x4

init:
    ila 5
    sta numberA
    sta numberB

for:
    lda numberB
    sta interations

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
    lda numberC
    cmd
    brk