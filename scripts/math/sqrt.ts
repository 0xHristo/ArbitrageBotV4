import { BigNumber } from "ethers"
import { BigNumber as BigNumber2 } from "bignumber.js"

export const sqrt = (number: BigNumber): BigNumber => {
    let l = BigNumber.from(0)
    let r = number.div(2)
    let mid = r.add(l).div(2)
    let res = mid

    while (l.lt(r)) {
        mid = r.add(l).div(2)
        if (mid.pow(2).eq(number)) {
            return mid
        } else if (mid.pow(2).lt(number)) {
            l = mid.add(1)
        } else {
            r = mid.sub(1)
        }
    }

    // console.log(mid)
    // console.log(mid.pow(2))
    // console.log(number)
    // console.log(l.pow(2))
    return l
}

// sqrt(BigNumber.from("1865818074127899016549746"))
// sqrt(BigNumber.from(4))
// sqrt(BigNumber.from(15129))