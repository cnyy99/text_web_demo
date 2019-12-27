const EntitySchema = require("typeorm").EntitySchema;
const Account = require("../model/Models").Account;
module.exports = new EntitySchema({
    name: "Account",
    target: Account,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
            unique: true,
        },
        pwd: {
            type: "varchar",
        },
        email: {
            type: "varchar",
        },
        type: {
            type: "varchar",
        },
    },
    relations: {
        texts: {
            type: 'one-to-many',
            target: 'Text',
            inverseSide: 'account',
            // cascade: true,
        },
        comments: {
            type: 'one-to-many',
            target: 'Comment',
            inverseSide: 'account',
        },
    },
});
