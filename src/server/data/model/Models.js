/*export */
class Account {
    constructor(name, pwd, createTime, email, type, texts, comments, id) {
        this.id = id;
        this.name = name;
        this.pwd = pwd;
        this.createTime = createTime;
        this.email = email;
        this.type = type;
        this.texts = texts;
        this.comments = comments;
    }
}

class Text {
    constructor(content, oldType, newType, dateTime, textComment, account, id, isUpdate) {
        this.id = id;
        this.content = content;
        this.oldType = oldType;
        this.newType = newType;
        this.dateTime = dateTime;
        this.textComment = textComment;
        this.account = account;
        this.isUpdate = isUpdate;
    }
}

class Comment {
    constructor(content, dateTime, account, id) {
        this.id = id;
        this.content = content;
        this.dateTime = dateTime;
        this.account = account;
    }
}

module.exports = {
    Account: Account,
    Text: Text,
    Comment: Comment,
};
