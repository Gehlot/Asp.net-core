using System.IO;
using System.Security.Cryptography;
using System;
using System.Text;
public static class Security {
    public static string Key  = "HR$2pIjHR$2pIj12";
    public static string Keycode  = "HR$2pIjHR$2pIj12";
    public static string FunForEncrypt (string objText) {
        byte[] objInitVectorBytes = Encoding.UTF8.GetBytes (Key);
        byte[] objPlainTextBytes = Encoding.UTF8.GetBytes (objText);
        PasswordDeriveBytes objPassword = new PasswordDeriveBytes (Keycode, null);
        byte[] objKeyBytes = objPassword.GetBytes (256 / 8);
        RijndaelManaged objSymmetricKey = new RijndaelManaged ();
        objSymmetricKey.Mode = CipherMode.CBC;
        ICryptoTransform objEncryptor = objSymmetricKey.CreateEncryptor (objKeyBytes, objInitVectorBytes);
        MemoryStream objMemoryStream = new MemoryStream ();
        CryptoStream objCryptoStream = new CryptoStream (objMemoryStream, objEncryptor, CryptoStreamMode.Write);
        objCryptoStream.Write (objPlainTextBytes, 0, objPlainTextBytes.Length);
        objCryptoStream.FlushFinalBlock ();
        byte[] objEncrypted = objMemoryStream.ToArray ();
        objMemoryStream.Close ();
        objCryptoStream.Close ();
        return Convert.ToBase64String (objEncrypted);
    }

    public static string FunForDecrypt (string EncryptedText) {
        byte[] objInitVectorBytes = Encoding.ASCII.GetBytes (Key);
        byte[] objDeEncryptedText = Convert.FromBase64String (EncryptedText);
        PasswordDeriveBytes objPassword = new PasswordDeriveBytes (Keycode, null);
        byte[] objKeyBytes = objPassword.GetBytes (256 / 8);
        RijndaelManaged objSymmetricKey = new RijndaelManaged ();
        objSymmetricKey.Mode = CipherMode.CBC;
        ICryptoTransform objDecryptor = objSymmetricKey.CreateDecryptor (objKeyBytes, objInitVectorBytes);
        MemoryStream objMemoryStream = new MemoryStream (objDeEncryptedText);
        CryptoStream objCryptoStream = new CryptoStream (objMemoryStream, objDecryptor, CryptoStreamMode.Read);
        byte[] objPlainTextBytes = new byte[objDeEncryptedText.Length];
        int objDecryptedByteCount = objCryptoStream.Read (objPlainTextBytes, 0, objPlainTextBytes.Length);
        objMemoryStream.Close ();
        objCryptoStream.Close ();
        return Encoding.UTF8.GetString (objPlainTextBytes, 0, objDecryptedByteCount);
    }
}