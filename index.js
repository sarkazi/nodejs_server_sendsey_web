import express from 'express'
import { google } from 'googleapis'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express();

app.use(cors());
dotenv.config()
app.use(express.json())



app.route('/api/google')
   .post(async (req, res) => {

      const data = req.body

      try {
         const auth = new google.auth.GoogleAuth({
            credentials: {
               client_email: process.env.G_CLIENT_EMAIL,
               private_key: process.env.G_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
            },
            scopes: 'https://www.googleapis.com/auth/spreadsheets'
         })

         const client = await auth.getClient()

         const googleSheets = google.sheets({ version: 'v4', auth: client })

         const spreadsheetId = process.env.SPREADSHEET_ID

        googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: 'Лист1',
            valueInputOption: 'USER_ENTERED',
            resource: {
               values: [
                  [new Date().toLocaleString().replace(/\./g, '/'), data?.name, data?.email, data?.phone, data?.error]
               ]
            }
         })
         
         res.send('Лид успешно добавлен в таблицу!')

        

      } catch (err) {
         console.log(err)
         res.status(400).send('Ошибка на стороне сервера!')
      }

   })

const port = process.env.PORT

app.listen(port, () => {
   console.log(`збс на ${port} порту`)
})
