import os


paths = [
    "1. Erfurt 18.000 Einwohner ",
    "2. Mühlhausen 7.500 Einwohner ",
    "3. Nordhausen 7.000 Einwohner ",
    "4. Schmalkalden 5.000 Einwohner ",
    "5. Eisenach 4.800 Einwohner ",
    "6. Weimar 3.800 Einwohner ",
    "7. Gotha 3.500 Einwohner ",
    "8. Arnstadt 3.400 Einwohner ",
    "9. Rudolstadt 3.300 Einwohner ",
    "10. Altenburg 3.100 Einwohner ",
    "11. Meiningen 3.000 Einwohner ",
    "12. Saalfeld 2.900 Einwohner ",
    "13. Gera 2.600 Einwohner ",
    "14. Jena 2.500 Einwohner ",
    "15. Suhl 2.400 Einwohner ",
    "16. Ilmenau 2.300 Einwohner ",
    "16. Sondershausen 2.300 Einwohner ",
    "17. Frankenhausen 2.200 Einwohner ",
    "17. Schleusingen 2.200 Einwohner ",
    "18. Salzungen 2.100 Einwohner ",
    "19. Greiz 2.000 Einwohner ",
    "20. Schleiz 1.800 Einwohner ",
]

base_path = "C:\\src\\ntlt\\virtualmuseum\\src\\tools\\data_import\\input\\schloss_wilhelmsburg\\grosser_saal\\tisch_1\\thueringen\\groesste_staedte\\Platz 1-10"
for path in paths:
    os.makedirs(os.path.join(base_path, path), exist_ok=True)
    print(f"Created folder {path}")
