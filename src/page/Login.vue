<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">欢迎使用绩效管理平台</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="user_name" class="bto">
                    <el-input v-model="param.user_name" placeholder="请输入账号">
                        <!-- <el-button slot="prepend" icon="el-icon-lx-people"></el-button> -->
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="param.password" @keyup.enter.native="submitForm()">
                        <!-- <el-button slot="prepend" icon="el-icon-lx-lock"></el-button> -->
                    </el-input>
                </el-form-item>
                <el-checkbox v-model="checkedPass" class="holdCheck" @keyup.enter.native="login">记住密码</el-checkbox>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
import { loginApi } from '@/api/index';
export default {
    data: function () {
        return {
            param: {
                user_name: 'aUser0000065',
                password: 'usrpwd_0000044'
            },
            rules: {
                user_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            },
            checkedPass: true
        };
    },
    methods: {
        submitForm() {
            this.$refs.login
                .validate((valid) => {
                    if (valid) {
                        loginApi(this.param).then((res) => {
                            if (res.allow === 1) {
                                this.$message.success('登录成功');
                                localStorage.setItem('ms_username', this.param.user_name);
                                this.$router.push('/');
                            } else {
                                this.$message.error('登录失败');
                            }
                        });
                    } else {
                        this.$message.error('请输入账号和密码');
                        console.log('error submit!!');
                        return false;
                    }
                })
                .catch((error) => {
                    this.$message.error('登录失败');
                });
        }
    }
};
</script>

<style scoped lang="less">
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    // background: pink;
    overflow: hidden;
    background-position: center;
}
.ms-title {
    font-size: 20px;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: 500;
    color: #333333;
    line-height: 29px;
    padding: 32px 28px 0;
}
.ms-login {
    position: absolute;
    left: 59.9%;
    top: 30%;
    width: 340px;
    height: 412px;
    background: #ffffff;
    box-shadow: 0px 4px 20px 0px #e4efff;
    border-radius: 16px;
    overflow: hidden;
}
.ms-content {
    padding: 30px 28px;
    /deep/.el-form-item--small.el-form-item {
        margin-bottom: 9px;
    }
    .bto {
        margin-bottom: 16px !important;
    }
    /deep/.holdCheck {
    }
}

.login-btn {
    text-align: center;
}
.login-btn button {
    position: absolute;
    width: 284px;
    height: 36px;
    bottom: 25px;
    left: 28px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
