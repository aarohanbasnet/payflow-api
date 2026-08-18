import { Resend } from "resend";
import { getTransactionTemplate, getWelcomeOtpEmailTemplate } from "./email.template.js";
import { env } from "../../../config/env.js";
import { AppError } from "../../../utils/error.js";

const resend = new Resend( env.RESEND_API_KEY);

export interface ISendEmailPayload {
    to : string,
    subject : string,
    html : string,
}

export interface ITransactionAlertPayload {
    to : string,
    name : string,
    accountNumber : string,
    amount : number,
    reference : string,
}

export interface IOTPPayload {
    to : string,
    name : string,
    otpCode : string,
}

const sendEmail = async({ to, subject, html} : ISendEmailPayload) =>{
    try {
        const response = await resend.emails.send({
            from : 'onboarding@resend.dev',
            to,
            subject,
            html,
        });

        if(response.error){
            throw new AppError(`Failed to send email: ${response.error.message}`, 500);
        }

        return response.data;
    } catch (error){
        if(error instanceof AppError ) throw error;

        throw new AppError("Email delivery service unavaiable", 500);
    }
};

export const sendTransactionAlertEmail = async( payload : ITransactionAlertPayload) => {
    const { name, accountNumber, amount, reference, to } = payload;
    const { subject, html } = getTransactionTemplate({name, accountNumber, amount, reference});

    return await sendEmail({
        to,
        subject,
        html
    });
};


export const sendOtpEmail = async ( payload : IOTPPayload) => {
    const {to, otpCode, name} = payload;
    const {subject, html } = getWelcomeOtpEmailTemplate({ otpCode, name });

    return await sendEmail({
        to,
        subject,
        html
    });
}


