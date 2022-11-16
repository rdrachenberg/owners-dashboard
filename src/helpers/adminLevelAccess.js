/* eslint-disable no-unused-vars */
export const adminLevelAccess = (level, accounts) => {
    if(level === '2') {
        let dump = accounts.pop();
        dump = '';
    
    } else if ( level === '3') {
        let frontDump = accounts.shift();
        frontDump = '';
    }

    

    // scrub any duplicates
    let unique = [...new Set(accounts)]

    return unique
}