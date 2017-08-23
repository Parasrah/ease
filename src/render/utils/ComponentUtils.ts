export const shouldUpdate = (curr: object, next: object, ...ignored: string[]) => {
    for (const key of Object.keys(curr)) {
        if (ignored.indexOf(key) !== -1 && curr[key] !== next[key]) {
            return false;
        }
    }

    return true;
};
