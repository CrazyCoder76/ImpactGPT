import { SetStateAction, useEffect, useRef, useState } from "react";
import { Input } from '@/components/ui/input';
import { updateEmailSetting } from "@/app/admin/email-settings/action";
import { toast } from "sonner";
import { IconSpinner } from "../ui/icons";
import { useRouter } from 'next/navigation'
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { sendTestEmail } from "@/actions/mail";
import { getSmtpSettings, updateSmtpSettings } from "@/actions/app_settings";

const SmtpConfigurer = ({ expanded, setExpanded }: {
  expanded: boolean,
  setExpanded: Function
}) => {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [testEmailTo, setTestEmailTo] = useState("");
  const [testSent, setTestSent] = useState(false);

  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [savePending, setSavePending] = useState(false);

  useEffect(() => {
    getSmtpSettings().then(smtpSettings => {
      console.log(smtpSettings);
      if (smtpSettings) {
        setHost(smtpSettings.smtp_host);
        setPort(smtpSettings.smtp_port);
        setUsername(smtpSettings.smtp_username);
        setPassword(smtpSettings.smtp_password);
        setSenderEmail(smtpSettings.sender_email);
        setSenderName(smtpSettings.sender_name);
        setReplyTo(smtpSettings.reply_email);
      }
    })
  }, [])

  const onSave = async () => {
    setSavePending(true);
    const res = await updateSmtpSettings({
      host,
      port,
      user: username,
      pass: password,
      sender_email: senderEmail,
      sender_name: senderName,
      reply_email: replyTo
    });
    if (res === 'success') {
      toast.success("Saved");
    }
    else {
      toast.error(res, { duration: 10000 })
    }
    setSavePending(false);
  }

  const onSendTest = async () => {
    setPending(true);
    const res = await sendTestEmail({ host, port, user: username, pass: password, reply_to: replyTo, from: senderEmail, to: testEmailTo });
    if (res === 'success') {
      toast.success("Email sent");
    }
    else {
      toast.error("Email was not sent");
      console.error(res);
    }
    setPending(false);
    setTestSent(true);
  }

  return (
    <div className="bg-white rounded-md shadow border-gray-200 border w-full">
      <div className="px-6 py-4 flex items-center justify-between space-x-2 cursor-pointer" onClick={() => { setExpanded(!expanded) }}>
        <div>
          <h2 className="text-xl font-semibold">
            Email Sender
          </h2>
          <span className="mt-1">
            Configure custom mail sender to send emails from different domain
          </span>
        </div>
        <button className="ml-auto text-gray-500 rounded-sm hover:bg-gray-100 transition-all flex items-center justify-center shrink-0">
          {!expanded ? (
            <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 20 20" className="size-8" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          ) : (
            <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 20 20" className="size-8" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"></path>
            </svg>
          )}
        </button>
      </div>
      {expanded && <>
        <div className="mt-4 px-6">
          <div className="m-auto max-w-[430px] flex flex-col gap-5">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mt-4 text-base font-semibold" htmlFor="host">SMTP Hostname</label>
                <Input
                  value={host}
                  id="host"
                  onChange={(e) => { setHost(e.target.value) }}
                  className='relative block w-full rounded-md border-0 text-gray-900 shadow-sm mt-1 ring-1 ring-inset ring-gray-300 px-3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 sm:text-sm sm:leading-6 min-h-[36px] max-h-[500px] resize-none dark:bg-zinc-600 dark:text-white dark:ring-gray-500 dark:focus:ring-blue-500 bg-white'
                />
              </div>
              <div className="w-[200px]">
                <label className="mt-4 text-base font-semibold" htmlFor="port">Port</label>
                <Input
                  value={port}
                  id="port"
                  onChange={(e) => { setPort(e.target.value) }}
                  className='relative block w-full rounded-md border-0 text-gray-900 shadow-sm mt-1 ring-1 ring-inset ring-gray-300 px-3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 sm:text-sm sm:leading-6 min-h-[36px] max-h-[500px] resize-none dark:bg-zinc-600 dark:text-white dark:ring-gray-500 dark:focus:ring-blue-500 bg-white'
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mt-4 text-base font-semibold" htmlFor="Username">SMTP Username</label>
                <Input
                  value={username}
                  id="Username"
                  onChange={(e) => { setUsername(e.target.value) }}
                  className='relative block w-full rounded-md border-0 text-gray-900 shadow-sm mt-1 ring-1 ring-inset ring-gray-300 px-3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 sm:text-sm sm:leading-6 min-h-[36px] max-h-[500px] resize-none dark:bg-zinc-600 dark:text-white dark:ring-gray-500 dark:focus:ring-blue-500 bg-white'
                />
              </div>
              <div className="w-[200px]">
                <label className="mt-4 text-base font-semibold" htmlFor="Password">SMTP Password</label>
                <Input
                  value={password}
                  type="password"
                  id="Password"
                  onChange={(e) => { setPassword(e.target.value) }}
                  className='relative block w-full rounded-md border-0 text-gray-900 shadow-sm mt-1 ring-1 ring-inset ring-gray-300 px-3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 sm:text-sm sm:leading-6 min-h-[36px] max-h-[500px] resize-none dark:bg-zinc-600 dark:text-white dark:ring-gray-500 dark:focus:ring-blue-500 bg-white'
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mt-4 text-base font-semibold" htmlFor="sender_email">Sender Email Address</label>
                <Input
                  value={senderEmail}
                  id="sender_email"
                  onChange={(e) => { setSenderEmail(e.target.value) }}
                  className='relative block w-full rounded-md border-0 text-gray-900 shadow-sm mt-1 ring-1 ring-inset ring-gray-300 px-3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 sm:text-sm sm:leading-6 min-h-[36px] max-h-[500px] resize-none dark:bg-zinc-600 dark:text-white dark:ring-gray-500 dark:focus:ring-blue-500 bg-white'
                />
              </div>
              <div className="w-[200px]">
                <label className="mt-4 text-base font-semibold" htmlFor="sender_name">Sender Name</label>
                <Input
                  value={senderName}
                  id="sender_name"
                  onChange={(e) => { setSenderName(e.target.value) }}
                  className='relative block w-full rounded-md border-0 text-gray-900 shadow-sm mt-1 ring-1 ring-inset ring-gray-300 px-3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 sm:text-sm sm:leading-6 min-h-[36px] max-h-[500px] resize-none dark:bg-zinc-600 dark:text-white dark:ring-gray-500 dark:focus:ring-blue-500 bg-white'
                />
              </div>
            </div>
            <div>
              <label className="mt-4 text-base font-semibold" htmlFor="reply_to">Reply-To Email Address</label>
              <Input
                value={replyTo}
                id="reply_to"
                onChange={(e) => { setReplyTo(e.target.value) }}
                className='relative block w-full rounded-md border-0 text-gray-900 shadow-sm mt-1 ring-1 ring-inset ring-gray-300 px-3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 sm:text-sm sm:leading-6 min-h-[36px] max-h-[500px] resize-none dark:bg-zinc-600 dark:text-white dark:ring-gray-500 dark:focus:ring-blue-500 bg-white'
              />
            </div>
            <Separator />
            <div className="flex gap-3 items-end">
              <div>
                <label className="mt-4 text-base font-semibold" htmlFor="test_email_to">Send a test email to:</label>
                <Input
                  value={testEmailTo}
                  id="test_email_to"
                  placeholder="Receiver email"
                  onChange={(e) => { setTestEmailTo(e.target.value) }}
                  className='relative block w-full rounded-md border-0 text-gray-900 shadow-sm mt-1 ring-1 ring-inset ring-gray-300 px-3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 sm:text-sm sm:leading-6 min-h-[36px] max-h-[500px] resize-none dark:bg-zinc-600 dark:text-white dark:ring-gray-500 dark:focus:ring-blue-500 bg-white'
                />
              </div>
              <div className="w-[200px]">
                <Button variant="default" onClick={onSendTest} disabled={pending} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-default transition-colors whitespace-nowrap gap-1 w-full">
                  {pending ? <IconSpinner /> : "→"} &nbsp;Send Test
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='my-6 text-center'>
          <button
            onClick={onSave}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${savePending ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400 gap-2`}
            disabled={savePending || !testSent}
          >
            {savePending ? <IconSpinner /> : "→"} &nbsp;Save
          </button>
        </div>
      </>}
    </div>
  );
}

export default SmtpConfigurer;