'use server'

import fs from 'fs';
import path from 'path';
import { auth } from '@/auth';
import dbConnect from '@/lib/db/mongoose'
import EmailSettingModel from '@/models/EmailSetting';
import { EmailSetting } from '@/lib/types';

export async function checkEmailSettingsExists() {
    try {
        const session = await auth();
        if (session && session.user) {
            await dbConnect();
            const collectionExists = await EmailSettingModel.db.db.listCollections({ name: 'email_settings' }).hasNext();
            if (!collectionExists) {
                const filePath = path.join(process.cwd(), 'db_json', 'email_settings.json');
                const jsonData = fs.readFileSync(filePath, 'utf8');
                const emailSettings = JSON.parse(jsonData);
                await EmailSettingModel.insertMany(emailSettings);
            }
        }
    } catch (err) {
        console.error(err);
        return {
            status: 500
        }
    }
}

export async function getEmailSettings() {
    try {
        const session = await auth();
        if (session && session.user) {
            await dbConnect();
            const emailSettings = await EmailSettingModel.find({});
            return {
                status: 200,
                data: JSON.stringify(emailSettings)
            }
        }
    } catch (err) {
        console.error(err);
        return {
            status: 500
        }
    }
}

export async function updateEmailSetting(data: EmailSetting) {
    try {
        const session = await auth();
        if (session && session.user) {
            await dbConnect();
            const updated_emailSetting = await EmailSettingModel.findOneAndUpdate({ name: data.name },
                {
                    subject: data.subject,
                    body: data.body
                });
            await updated_emailSetting.save();
            return {
                status: 200
            }
        }
    } catch (err) {
        console.error(err);
        return {
            status: 500
        }
    }
}