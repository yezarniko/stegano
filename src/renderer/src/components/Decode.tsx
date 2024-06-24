import ChooseImgIcon from '@/assets/chooseImg.png'
import FileIcon from '@/assets/file.png'
import FilesIcon from '@/assets/files.svg'
import Thumbnail from '@/assets/thumbnail.png'
import {
  ACCEPT_FILE_TYPES,
  Button,
  FileWithPath,
  PasswordInput,
  shortenName
} from '@/components/Encode'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

interface DecodeResponse {
  id: number
  decryptedFile: string
  filename: string
  filesize: string
  filetype: string
  modifiedDate: string
  passwordMatch: boolean
}

function Decode() {
  const [encryptedImage, setEncryptedImage] = useState<FileWithPath | null>(null)
  const [encryptedImageDataPath, setEncryptedImageDataPath] = useState('')
  const [decryptedFileMetaData, setDecryptedFileMetaData] = useState<DecodeResponse>({
    id: 2,
    filename: '-',
    decryptedFile: '',
    filesize: '-',
    filetype: '-',
    modifiedDate: '-',
    passwordMatch: false
  })
  const [password, setPassword] = useState('')
  const inputFileRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  function decrypt() {
    if (encryptedImage) {
      setLoading(true)
      window.context.runPython(['decode.py', encryptedImage.path, password])
      window.context.onPythonResponse((response) => {
        const data = JSON.parse(response) as DecodeResponse
        setTimeout(() => setLoading(false), 1000)
        switch (data.id) {
          case 2:
            if (data.passwordMatch) {
              setDecryptedFileMetaData(data)
              setPassword('')
            } else {
              setShowPopup(true)
              setTimeout(() => {
                setShowPopup(false)
              }, 6000)
            }
            break
          default:
            break
        }
      })
    }
  }

  useEffect(() => {
    if (encryptedImage) {
      const reader = new FileReader()

      reader.onloadend = () => {
        setEncryptedImageDataPath(reader.result as string)
      }

      reader.readAsDataURL(encryptedImage)
    }
  }, [encryptedImage])

  return (
    <div className="w-full h-full flex">
      {loading && <Loading />}
      <div className="px-11 min-w-96  flex flex-col justify-center items-center  bg-slate-100 dark:bg-slate-700">
        <div
          onClick={() => inputFileRef.current?.click()}
          className={clsx(
            'w-5/6 max-w-96 aspect-square bg-slate-50 dark:bg-slate-800 border-4 border-slate-400 flex flex-col items-center justify-center',
            'cursor-pointer  scale-90 mb-7',
            !encryptedImage && 'border-dashed rounded-xl'
          )}
        >
          {encryptedImageDataPath === '' ? (
            <>
              <img src={ChooseImgIcon} className="inline-block w-1/6 mb-5" />
              <h2 className="font-bold text-lg text-[#7C8EEE]">Choose Secret Image</h2>
            </>
          ) : (
            <img src={encryptedImageDataPath} className="w-100 aspect-square object-cover" />
          )}
          <input
            type="file"
            multiple={false}
            className="hidden"
            ref={inputFileRef}
            onChange={() => {
              if (inputFileRef.current && inputFileRef.current.files) {
                const currentFile = inputFileRef.current.files[0]
                if (ACCEPT_FILE_TYPES.find((type) => type === currentFile.type)) {
                  setEncryptedImage(inputFileRef.current.files[0] as FileWithPath)
                }
              }
            }}
          />
        </div>

        <PasswordInput placeholder="Enter your password" {...{ password, setPassword }} />
        <Button
          enable={Boolean(encryptedImage) && password != ''}
          label="Decode"
          clickHandler={decrypt}
        />
        {showPopup && (
          <h2 className="text-red-400 dark:text-red-400 font-bold">Incorrect Password!</h2>
        )}
      </div>
      <div className="w-4/5 xl:w-2/5 dark:bg-slate-800 bg-slate-200 flex flex-col items-center pt-36">
        <div className=" w-5/6 pt-20  ">
          <h2 className="font-bold text-lg ml-4 dark:text-[#7C8EEE] mb-6">Your Secret File</h2>
          <div className="min-w-60 w-2/4 bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-3xl box-content cursor-pointer border-slate-300 border-2 scale-90 flex items-center justify-between">
            <span className="font-bold text-base">
              {shortenName(decryptedFileMetaData.filename, 20, 12)}
            </span>
            <img
              src={FileIcon}
              className="inline-block w-1/6"
              onClick={() => {
                if (decryptedFileMetaData.decryptedFile !== '') {
                  window.context.saveFile(decryptedFileMetaData.decryptedFile)
                }
              }}
            />
          </div>

          <h2 className="font-bold text-lg ml-4 dark:text-[#7C8EEE] mt-10 mb-6 ">Meta Data</h2>
          <div className="backdrop-blur-lg border-2 rounded-2xl border-slate-400/50 dark:bg-slate-800/50 p-3">
            <table className="table-auto">
              <tbody>
                <tr>
                  <td className="px-4 py-2">Name:</td>
                  <td className="px-4 py-2">
                    {shortenName(decryptedFileMetaData.filename, 20, 12)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Size:</td>
                  <td className="px-4 py-2">{decryptedFileMetaData.filesize}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Type:</td>
                  <td className="px-4 py-2">{decryptedFileMetaData.filetype}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Created Date:</td>
                  <td className="px-4 py-2">{decryptedFileMetaData.modifiedDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function Loading() {
  return (
    <div className="absolute inset-0 scale-[.55] backdrop-blur-lg border-2 rounded-2xl border-slate-400/50 dark:bg-slate-800/50 bg-slate-200/60 z-20 flex items-center justify-start">
      <img src={Thumbnail} className="w-1/2 scale-[.4] z-10" />
      <img
        src={FilesIcon}
        className="absolute left-0 w-1/2 scale-50 animate-translateRight_de z-0"
      />
      <div className="absolute bottom-32 inset-x-0 text-center font-bold text-3xl">
        Decoding ...
      </div>
    </div>
  )
}

export default Decode
