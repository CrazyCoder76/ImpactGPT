import mongoose from "mongoose";
import { EmailSetting } from "@/lib/types";

const EmailSettingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true
    }
}, {
    collection: 'email_settings'
})

export default mongoose.models.EmailSetting || mongoose.model<EmailSetting>('EmailSetting', EmailSettingSchema)