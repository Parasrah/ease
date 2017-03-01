export const shouldUpdate = (props: Object, nextProps: Object, ...ignored: string[]) => {
    for (const key of Object.keys(props)) {
        if (ignored.indexOf(key) !== -1 && props[key] !== nextProps[key]) {
            return false;
        }
    }
    return true;
};
