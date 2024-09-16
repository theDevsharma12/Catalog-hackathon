const baseToDecimal = (value, base) => {
    return parseInt(value, base);
};

const lagrangeInterpolation = (xValues, yValues) => {
    const L = (k, x) => {
        return xValues.reduce((acc, _, m) => {
            if (m === k) return acc;
            return acc * (x - xValues[m]) / (xValues[k] - xValues[m]);
        }, 1);
    };

    const P = (x) => {
        return yValues.reduce((sum, _, k) => {
            return sum + yValues[k] * L(k, x);
        }, 0);
    };

    return P(0); // Find the polynomial value at x=0
};

const solveSecretSharing = (jsonInput) => {
    const data = JSON.parse(jsonInput);
    const n = data.keys.n;
    const k = data.keys.k;
   
    let xValues = [];
    let yValues = [];
   
    for (const key in data) {
        if (key === 'keys') continue;
       
        const base = parseInt(data[key].base);
        const value = data[key].value;
       
        const x = parseInt(key);
        const y = baseToDecimal(value, base);
       
        xValues.push(x);
        yValues.push(y);
    }
   
    if (xValues.length < k) {
        throw new Error("Insufficient number of points provided.");
    }
   
    // Solve for the constant term 'c' of the polynomial
    const secret = lagrangeInterpolation(xValues.slice(0, k), yValues.slice(0, k));
   
    return secret;
};


const jsonInput1 = `
{
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
}
`;
const jsonInput2 = `
{
    "keys": {
        "n": 9,
        "k": 6
    },
    "1": {
        "base": "10",
        "value": "28735619723837"
    },
    "2": {
        "base": "16",
        "value": "1A228867F0CA"
    },
    "3": {
        "base": "12",
        "value": "32811A4AA0B7B"
    },
    "4": {
        "base": "11",
        "value": "917978721331A"
    },
    "5": {
        "base": "16",
        "value": "1A22886782E1"
    },
    "6": {
        "base": "10",
        "value": "28735619654702"
    },
    "7": {
        "base": "14",
        "value": "71AB5070CC4B"
    },
    "8": {
        "base": "9",
        "value": "122662581541670"
    },
    "9": {
        "base": "8",
        "value": "642121030037605"
    }
}
`;

const secret1 = solveSecretSharing(jsonInput1);
const secret2 = solveSecretSharing(jsonInput2);
console.log(`The constant term 'c' of the polynomial is: ${secret1}`);
console.log(`The constant term 'c' of the polynomial is: ${secret2}`);
