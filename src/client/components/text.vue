<template>
    <div class="yellowback">
        <el-row class="el-myrow">
            <el-col :span="8" :offset="6">
                <a href="/"><el-image class="el-logo" src="/static/logo1-t.png" fit="scale-down"></el-image></a>
                <div class="grid-content bg-purple">
                    <strong>404</strong>. That's an error.
                    <br>
                    <br>
                    The requested URL {{$route.path}} was not found on this server.
                    <br>
                    That's all we know.
                </div>
            </el-col>
            <el-col :span="7" :offset="1">
                <el-image class="el-logo" src="/static/robot.png" fit="scale-down"></el-image>

            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "notFound"
    }
</script>

<style>
    body {
        background: #ECBB17;
    }
    .yellowback{
        padding-top: 15%;
    }
</style>
