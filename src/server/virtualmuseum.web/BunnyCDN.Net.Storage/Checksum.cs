using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace BunnyCDN.Net.Storage
{
    internal class Checksum
    {
        internal static string Generate(Stream stream)
        {
            var checksumData = SHA256.HashData(stream);
            return BitConverter.ToString(checksumData).Replace("-", String.Empty);
        }
    }
}