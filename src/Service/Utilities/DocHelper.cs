using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using Model;

namespace Service.Utilities
{
    public class DocHelper
    {
        /// <summary>
        ///     Gets valid extensions.
        /// </summary>
        /// <returns>Returns a hash set of valid document extensions.</returns>
        public static HashSet<string> GetValidExtensions()
        {
            return new HashSet<string> { "doc", "docx", "txt", "pdf", "xls", "xlsx",  "ppt", "pptx", "csv", "jpg", "jpeg",
                "gif", "png", "tif", "tiff", "bmp" };
        }

        /// <summary>
        ///     Gets the docs folder path from app settings and safely
        ///     combines with file name.
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns>Returns a full file path with docs folder prepended.</returns>
        public static string PrependDocsPath(string filePath)
        {
            return System.IO.Path.Combine(AppSettings.GetDocsRootDirectory(), filePath);
        }

        /// <summary>
        ///     Makes sure we have a dot before the extension in case
        ///     Andy is lazy.
        /// </summary>
        /// <param name="extension"></param>
        /// <returns></returns>
        public static string CheckExtensionDot(string extension)
        {
            if (extension[0] != '.')
                extension = '.' + extension;
            return extension;
        }

        /// <summary>
        ///     Takes a date time and makes it a friendlier string for file names.
        /// </summary>
        /// <param name="datePosted"></param>
        /// <returns></returns>
        public static string FormatFileTimeStamp(DateTime datePosted)
        {
            // ReSharper disable once SpecifyACultureInStringConversionExplicitly
            return datePosted.ToString().Replace("/", "_").Replace(":", "_").Replace(" ", "_");
        }

        /// <summary>
        ///     Creates a base doc name, using timestamp to avoid caching.
        /// </summary>
        /// <returns></returns>
        public static string CreateDocFileBaseName()
        {
            return $"{Guid.NewGuid()}_{FormatFileTimeStamp(DateTime.UtcNow)}";
        }

        /// <summary>
        ///     Validates file extension for documents.
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns>Returns a boolean indicating whether extension is valid.</returns>
        public static bool HaveAValidDocExtension(string fileName)
        {
            var ext = fileName.Split('.').LastOrDefault();
            return ext != null && GetValidExtensions().Contains(ext.ToLower());
        }

        public static Document GenerateDocumentRecord(string fileName, int uploadedBy)
        {
            var ext = fileName.Split('.').Last();
            ext = CheckExtensionDot(ext);
            var document = new Document
            {
                Name = fileName,
                FilePath = CreateDocFileBaseName() + ext,
                UploadedBy = uploadedBy,
                DateUpload = DateTime.UtcNow
            };
            return document;
        }
    }

    internal class DocumentValidator : AbstractValidator<Document>
    {
        public DocumentValidator()
        {
            RuleFor(d => d.Name).NotEmpty().Length(0, 200).Must(DocHelper.HaveAValidDocExtension);
            RuleFor(d => d.FilePath).NotEmpty().Length(0, 200);
            RuleFor(d => d.UploadedBy).NotEmpty().GreaterThan(0);
            RuleFor(d => d.DateUpload).NotEmpty();
        }
    }
}
