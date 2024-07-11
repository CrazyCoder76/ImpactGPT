export default function LoginWithAzureAD() {
  return (
    <button type="submit" className="inline-flex items-center px-3 border shadow-sm leading-4 font-medium rounded-md h-[42px] sm:h-[38px] text-sm border-gray-300 text-gray-500 bg-white hover:bg-gray-100  w-full">
      <span className="max-w-full overflow-hidden">
        <div className="flex items-center w-full text-blue-500">
          <svg className="size-5 shrink-0 overflow-visible m-[2px]" aria-hidden="true" viewBox="0 0 20 20">
            <g clip-path="url(#clip0_2269_3296)">
              <path d="M0 0H20V20H0V0Z" fill="#F3F3F3">
              </path>
              <path d="M0.870117 0.869141H9.56577V9.56479H0.870117V0.869141Z" fill="#F35325">
              </path>
              <path d="M10.4346 0.869141H19.1303V9.56479H10.4346V0.869141Z" fill="#81BC06">
              </path>
              <path d="M0.870117 10.4346H9.56577V19.1302H0.870117V10.4346Z" fill="#05A6F0">
              </path>
              <path d="M10.4346 10.4346H19.1303V19.1302H10.4346V10.4346Z" fill="#FFBA08">
              </path>
            </g>
            <defs>
              <clipPath id="clip0_2269_3296">
                <rect width="20" height="20" fill="white">
                </rect>
              </clipPath>
            </defs>
          </svg>
          <div className="ml-3">
            Sign in with Azure AD</div>
        </div>
      </span>
    </button>
  )
}