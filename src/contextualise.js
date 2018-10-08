module.exports = (context) => {
    return (variable) => {
        if (!variable) {
            return context;
        } else {
            return context ? `${context}.${variable}` : variable;
        }
    };
};
