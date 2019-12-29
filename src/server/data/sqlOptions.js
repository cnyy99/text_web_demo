let sqlOptions = {
    type: 'mysql', // 数据库类型
    host: '127.0.0.1', // 数据库地址
    port: 3306, // 数据库端口号
    username: 'root', // 数据库用户名
    password: 'mysqL6878.', // 密码
    database: 'text', // 数据库名
    entities: [
        require("./entity/AccountSchema"),
        require("./entity/TextSchema"),
        require("./entity/CommentSchema"),
    ], // 引入实体
    synchronize: false,
};
export default sqlOptions
