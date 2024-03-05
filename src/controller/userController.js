import UserService from '../services/usersService.js';
import { sendEmail } from '../utils/emailTransport.js';
import { createHash, generateToken, tokenVerify, validatePass } from '../utils/passportUtils.js';


class UserController {
    constructor() {
        this.userService = new UserService();
    }
    premiumGet = async (req, res) => {
        try {
            const user = req.user
            if (user._id === req.params.uid) {
                res.render('premiumUser', { session: { user }});
            }
            else{
                res.status(403).send('Forbidden')
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    premiumPost = async (req, res) => {
        try {
            const userId = req.params.uid;
            let user = req.user;
    
            let updatedRole;
            if (user.role === "user") {
                updatedRole = "premium";
            } else if (user.role === "premium") {
                updatedRole = "user";
            }
    
            await this.userService.updateUser(userId, { role: updatedRole });
            const updatedUser = await this.userService.getUserById(userId);
            res.json(updatedUser);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    };

    
    passwordReset = async (req, res) => {
        try {
            let {email}= req.body
            let user = await this.userService.showUser(email)
            let redirectUrl;
    
            if (!user){
                redirectUrl = '/passwordreset?error=User not found or email invalid';
                return res.status(404).redirect(redirectUrl);
            } else {
                let token = generateToken(user);
                let resetLink = `http://localhost:8080/api/users/passwordreset2?token=${token}`;
                let emailMessage = `Hello. You have requested to reset your password. Please click on the following link: <a href="${resetLink}">Reset password</a> If you did not request a password reset, no action is required.`;
    
                let response = await sendEmail(email, "Password reset", emailMessage);
    
                if (response.accepted.length > 0){
                    redirectUrl = '/passwordreset?message=We have sent a message to your email, please follow the steps outlined there.';
                    return res.status(200).redirect(redirectUrl);
                } else {
                    redirectUrl = '/passwordreset?error=Problem with your password reset detected';
                    return res.status(500).redirect(redirectUrl);
                }
            }
        } catch (error) {
            return res.status(500).send(error.message);
        }
    };

    passwordReset2 = async (req, res) => {
        try {
            let redirectUrl;
            let {token}=req.query
            let tokenCheck = tokenVerify(token)
            if(!tokenCheck){
                redirectUrl = '/passwordreset?error=Token invalid or expired!';
                return res.status(400).redirect(redirectUrl);
            } else {
                redirectUrl = '/passwordreset2?token=' + token;
                return res.status(200).redirect(redirectUrl);
            }
        } catch (error) {
            redirectUrl = '/passwordreset?error=Problem with your password reset detected' + error.message;
            return res.status(500).redirect(redirectUrl);
        }
    };
    
    passwordReset3 = async (req, res) => {
        let {password, password2, token}=req.body;
        let redirectUrl;
    
        if(password!==password2){
            redirectUrl = '/passwordreset2?error=Password dont match!&token=' + token;
            return res.status(400).redirect(redirectUrl);
        }
    
        try {
            let tokenCheck = tokenVerify(token)
            let user=await this.userService.showUser(tokenCheck.email)
            if(!user){
                redirectUrl = '/passwordreset2?error=Problem creating new password&token=' + token;
                return res.status(400).redirect(redirectUrl);
            }
            if(validatePass(user, password)){
                redirectUrl = '/passwordreset2?error=You cannot use the same old password&token=' + token;
                return res.status(400).redirect(redirectUrl);
            } else {
                let hashedPassword = createHash(password);
                await this.userService.updateOne({email:user.email}, {password:hashedPassword});
                redirectUrl = '/login?message=Password changed successfully';
                return res.status(200).redirect(redirectUrl);
            }
        } catch (error) {
            redirectUrl = '/passwordreset2?error=Problem creating new password&token=' + token + error.message;
            return res.status(500).redirect(redirectUrl);
        }
    };
}

export default new UserController();