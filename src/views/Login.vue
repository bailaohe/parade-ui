/*
 * @Author: Michael
 * @Date: 2017-08-16 16:00:12
 * @Last Modified by: Michael
 * @Last Modified time: 2017-08-26 18:57:28
 */

<template>
    <div id="login">
        <Background container="login"></Background>
        <div class="content">
            <span class="title">
                Parade Admin
            </span>
        </div>

        <div class="login-box">
            <form class="login-form">
                <div class="groups-input">
                    <div class="username input-wrapper">
                        <span class="iconfont icon">&#xe600;</span>
                        <input type="text" name="username" placeholder="Username" v-model="username" autocomplete="off">
                    </div>
                    <div class="password input-wrapper">
                        <span class="iconfont icon">&#xe628;</span>
                        <input type="password" name="password" placeholder="Password" v-model="password" autocomplete="off" @keyup.enter="loginInByEnter">
                    </div>
                </div>
                <div class="button-wrapper">
                    <button type="button" class="sign-button" @click="loginIn">
                        Login
                    </button>

                </div>
            </form>
        </div>
    </div>
</template>

<script>

// import md5 from 'blueimp-md5';
// import User from '../core/user';
 import Background from '@/components/Background';
// import LoginService from '@/service/LoginService';

export default {
    components: {
        Background,
    },
    data() {
        return {
            username: '',
            password: '',
        };
    },

    methods: {

        // 登陆
        loginIn() {
            const username = this.username;
            const password = this.password;

            if (!username) {
                this.$message({
                    message: '用户名不能为空',
                    type: 'warning',
                });
            } else if (!password) {
                this.$message({
                    message: '密码不能为空',
                    type: 'warning',
                });
            }

            if (username === 'parade' && password === 'parade') {
                this.$router.push({name: 'Flow'})
            } else {
                this.$message({
                    message: '用户名或密码错误',
                    type: 'error'
                })
            }
        },

        // 按enter登录
        loginInByEnter() {
            if (this.isLogin) {
                this.loginIn();
            }
        },
    },
};
</script>


<style lang="less">
#login {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #2c3e50;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    z-index: 0;
    .content {
        display: flex;
        flex-direction: column;
        margin-top: -4rem;
        z-index: 11;
        align-items: center;
        .title {
            font-size: 0.72rem;
            color: #fff;
        }
    }
    .login-box {
        z-index: 11;
        margin-top: 0.8rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        .login-form {
            font-size: 0.32rem;
            width: 7.2rem;
            .groups-input {
                border: 0.02rem solid #d5d5d5;
                width: 100%;
                border-radius: 0.06rem;
                .input-wrapper {
                    background: #fff;
                    display: flex;
                    width: 100%;
                    .icon {
                        line-height: 1rem;
                        margin-left: 0.3rem;
                        color: #0f88eb;
                    }
                    input {
                        line-height: 0.38rem;
                        width: 100%;
                        padding: 1em .8em;
                    }
                }
                .username {
                    border-bottom: 1px solid #d5d5d5;
                }
            }
            .button-wrapper {
                margin-top: 0.44rem;
                .sign-button {
                    cursor: pointer;
                    background: #0f88eb;
                    box-shadow: none;
                    border: 0;
                    border-radius: 0.06rem;
                    line-height: 0.82rem;
                    color: #fff;
                    width: 100%;
                    font-size: 0.32rem;
                }
            }
        }
    }
}
</style>
