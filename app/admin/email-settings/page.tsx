'use client'

import React from 'react';
import TemplateItem from '@/components/email-settings/templateItem';
import { EmailSetting } from '@/lib/types';
import { getEmailSettings } from '@/app/admin/email-settings/action';
import SmtpConfigurer from '@/components/email-settings/SmtpConfigurer';

const IndexPage = () => {
    const [emailSettings, setEmailSettings] = React.useState<EmailSetting[]>([]);
    const [expanded, setExpanded] = React.useState<boolean[]>([]);

    React.useEffect(() => {
        const fetchEmailSettings = async () => {
            const res = await getEmailSettings();
            if (res?.status === 200 && res?.data) {
                setEmailSettings(JSON.parse(res?.data));
                setExpanded(new Array(JSON.parse(res?.data).length).fill(false));
            }
        }

        fetchEmailSettings();
    }, []);

    const handleExpandClick = (index: number) => {
        const newExpanded = [...expanded];
        newExpanded[index] = !newExpanded[index];
        setExpanded(newExpanded);
    }

    const handleSubjectChange = (index: number, value: React.SetStateAction<string>) => {
        const newSettings = [...emailSettings];
        newSettings[index].subject = typeof value === 'function' ? value(newSettings[index].subject) : value;
        setEmailSettings(newSettings);
    }

    const handleBodyChange = (index: number, value: React.SetStateAction<string>) => {
        const newSettings = [...emailSettings];
        newSettings[index].body = typeof value === 'function' ? value(newSettings[index].body) : value;
        setEmailSettings(newSettings);
    }

    return (
        <>
            <div className="w-full min-w-0">
                <div className="grow bg-gray-50 p-6 pb-20">
                    <div className="mx-auto duration-300 max-w-3xl">
                        <div className="space-y-8">
                            <SmtpConfigurer expanded={expanded[2]} setExpanded={() => handleExpandClick(2)} />
                            {emailSettings?.length > 0 && <>
                                <TemplateItem name={emailSettings[0]?.name} description='Customize the login email content users receive when logging in' code={true} expanded={expanded[0]} setExpanded={() => handleExpandClick(0)} subject={emailSettings[0]?.subject} setSubject={(value) => handleSubjectChange(0, value)} body={emailSettings[0]?.body} setBody={(value) => handleBodyChange(0, value)} />
                                <TemplateItem name={emailSettings[1]?.name} description='Change the invitation email content sent to new users.' code={false} expanded={expanded[1]} setExpanded={() => handleExpandClick(1)} subject={emailSettings[1]?.subject} setSubject={(value) => handleSubjectChange(1, value)} body={emailSettings[1]?.body} setBody={(value) => handleBodyChange(1, value)} />
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default IndexPage;
