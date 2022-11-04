<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title"><img src="../assets/img/logo2.png" class="min-logo" />欢迎使用绩效管理平台</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="user_name" class="bto">
                    <el-input v-model="param.user_name" placeholder="请输入账号" maxlength="18">
                        <!-- <el-button slot="prepend" icon="el-icon-lx-people"></el-button> -->
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="请输入密码"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                        maxlength="18"
                    >
                        <!-- <el-button slot="prepend" icon="el-icon-lx-lock"></el-button> -->
                    </el-input>
                </el-form-item>
                <el-checkbox v-model="checkedPass" class="holdCheck">记住密码</el-checkbox>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()" :loading="loginLoading">登录</el-button>
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
import md5 from 'js-md5';
import { loginApi } from '@/api/index';
export default {
    data: function () {
        return {
            param: {
                user_name: localStorage.getItem('ms_username') || '',
                password: localStorage.getItem('ms_passWord') || ''
            },
            rules: {
                user_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            },
            checkedPass: localStorage.getItem('ms_passWord') ? true : false,
            loginLoading: false
        };
    },
    created() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('login_expire');
    },
    methods: {
        submitForm() {
            this.$refs.login.validate((valid) => {
                if (valid) {
                    this.loginLoading = true;
                    let parmasObj = {
                        user_name: this.param.user_name,
                        password: md5(this.param.password)
                    };
                    // this.param.password = md5(this.param.password);
                    loginApi(parmasObj).then((res) => {
                        if (res.allow === 1) {
                            this.$message.success('登录成功');
                            localStorage.setItem('ms_username', this.param.user_name);
                            localStorage.setItem('ms_passWord', this.param.password);
                            sessionStorage.setItem('login_expire', res.expire);
                            sessionStorage.setItem('token', res.token);
                            sessionStorage.setItem('role', res.role);
                            sessionStorage.setItem('user_type', res.user_type);
                            this.$router.push('/dashboard');
                            // 不记住密码
                            if (!this.checkedPass) {
                                localStorage.removeItem('ms_passWord');
                            }
                        } else {
                            this.$message.error('登陆失败，请检查用户名或密码');
                        }
                    });
                    setTimeout(() => {
                        this.loginLoading = false;
                    }, 2500);
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
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
    padding: 40px 28px 0;

    .min-logo {
        width: 37px;
        height: 28px;
        margin-right: 12px;
        margin-bottom: -5px;
        // line-height: 18px;
    }
}
.ms-login {
    position: absolute;
    left: 62.4%;
    top: 30%;
    width: 398px;
    height: 380px;
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
        margin-bottom: 20px !important;
    }
    /deep/.holdCheck {
        margin-top: 5px;
    }
}

.login-btn {
    text-align: center;
}
.login-btn button {
    position: absolute;
    width: 342px;
    height: 32px;
    bottom: 48px;
    left: 28px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
