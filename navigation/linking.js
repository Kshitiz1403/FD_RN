const config = {
    screens: {
        Explore: {
            path: "Explore"
        },
        Account: {
            path: "Account"
        },
        Cart: {
            path: "Cart"
        },
        Restaurant_Screen: {
            path: "Restaurant/:restaurantID/:restaurantName",
        },
        Login: {
            path: "auth"
        }
    }
}

const linking = {
    prefixes: ["demo://app"],
    config
}

export default linking