Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Background dark purple
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point($width, $height)),
    [System.Drawing.ColorTranslator]::FromHtml("#07040f"),
    [System.Drawing.ColorTranslator]::FromHtml("#160a2b")
)
$g.FillRectangle($bgBrush, 0, 0, $width, $height)

# Ambient glowing nebula circles
$nebulaPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$nebulaPath.AddEllipse(650, 60, 650, 480)
$pthGrBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush($nebulaPath)
$pthGrBrush.CenterColor = [System.Drawing.Color]::FromArgb(130, 168, 85, 247)
$pthGrBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 7, 4, 15))
$g.FillPath($pthGrBrush, $nebulaPath)

$nebulaPath2 = New-Object System.Drawing.Drawing2D.GraphicsPath
$nebulaPath2.AddEllipse(-100, 200, 550, 500)
$pthGrBrush2 = New-Object System.Drawing.Drawing2D.PathGradientBrush($nebulaPath2)
$pthGrBrush2.CenterColor = [System.Drawing.Color]::FromArgb(100, 232, 121, 249)
$pthGrBrush2.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 7, 4, 15))
$g.FillPath($pthGrBrush2, $nebulaPath2)

# Subtle architectural grid lines
$gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(25, 196, 181, 253), 1)
for ($x = 60; $x -lt $width; $x += 60) {
    $g.DrawLine($gridPen, $x, 0, $x, $height)
}
for ($y = 60; $y -lt $height; $y += 60) {
    $g.DrawLine($gridPen, 0, $y, $width, $y)
}

# Border frame
$framePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(70, 196, 181, 253), 2)
$g.DrawRectangle($framePen, 40, 40, $width - 80, $height - 80)

# Stardust particles
$rnd = New-Object System.Random(42)
$starBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 244, 239, 254))
$violetStar = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 196, 181, 253))
$magentaStar = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 232, 121, 249))

for ($i = 0; $i -lt 140; $i++) {
    $sx = $rnd.Next(50, $width - 50)
    $sy = $rnd.Next(50, $height - 50)
    $size = $rnd.Next(1, 4)
    $b = if ($i % 3 -eq 0) { $magentaStar } elseif ($i % 2 -eq 0) { $violetStar } else { $starBrush }
    $g.FillEllipse($b, $sx, $sy, $size, $size)
}

# Fonts
$fontLogo = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Bold)
$fontSup = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)
$fontPill = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$fontTitle = New-Object System.Drawing.Font("Arial", 62, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Segoe UI", 25, [System.Drawing.FontStyle]::Bold)
$fontChips = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Regular)
$fontCTA = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$fontDomain = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$fontMeta = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Regular)

# Colors
$logoBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#ffffff"))
$violetBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#a855f7"))
$lilacBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#c4b5fd"))
$dimBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(190, 244, 239, 254))
$limeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#c6ff4a"))

# Top Bar: MS logo badge
$g.DrawString("MS", $fontLogo, $logoBrush, 90, 80)
$g.DrawString("®", $fontSup, $violetBrush, 142, 80)

# Status Pill: DISPONÍVEL PARA PROJETOS
$pillPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 196, 181, 253), 1)
$pillBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 13, 8, 25))
$pillRect = New-Object System.Drawing.Rectangle(820, 80, 290, 42)
$g.FillRectangle($pillBg, $pillRect)
$g.DrawRectangle($pillPen, $pillRect)
$g.FillEllipse($limeBrush, 842, 96, 10, 10)
$g.DrawString("DISPONÍVEL PARA PROJETOS", $fontPill, $lilacBrush, 862, 92)

# Central Display Titles
$g.DrawString("MICHAEL SILVA", $fontTitle, $logoBrush, 86, 172)

$subBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(90, 255)),
    (New-Object System.Drawing.Point(800, 255)),
    [System.Drawing.ColorTranslator]::FromHtml("#c4b5fd"),
    [System.Drawing.ColorTranslator]::FromHtml("#e879f9")
)
$g.DrawString("Desenvolvedor Full Stack & Analista de Sistemas", $fontSub, $subBrush, 88, 258)

# Tagline / Call to Action note
$g.DrawString("Sistemas robustos, arquiteturas limpas e experiências digitais 3D interativas.", $fontChips, $dimBrush, 90, 314)

# Tech stack chips
$tags = @("TypeScript", "React", "Lua", "Node.js", "Three.js", "PostgreSQL", "DevOps", "Brasília, DF")
$tx = 90
$ty = 368
$chipBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60, 168, 85, 247))
$chipPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 196, 181, 253), 1)

foreach ($tag in $tags) {
    $size = $g.MeasureString($tag, $fontChips)
    $w = [int]$size.Width + 24
    $h = 34
    $rect = New-Object System.Drawing.Rectangle($tx, $ty, $w, $h)
    $g.FillRectangle($chipBg, $rect)
    $g.DrawRectangle($chipPen, $rect)
    $g.DrawString($tag, $fontChips, $logoBrush, ($tx + 12), ($ty + 6))
    $tx += $w + 10
}

# Bottom Bar Line
$linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(50, 196, 181, 253), 1)
$g.DrawLine($linePen, 90, 460, 1110, 460)

# Prominent CTA Button: "VISITAR PORTFÓLIO 3D ↗" (High Conversion Call to Action)
$ctaRect = New-Object System.Drawing.Rectangle(90, 490, 330, 54)
$ctaBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(90, 490)),
    (New-Object System.Drawing.Point(420, 544)),
    [System.Drawing.ColorTranslator]::FromHtml("#9333ea"),
    [System.Drawing.ColorTranslator]::FromHtml("#d946ef")
)
$g.FillRectangle($ctaBrush, $ctaRect)
$ctaPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#fdf4ff"), 2)
$g.DrawRectangle($ctaPen, $ctaRect)
$g.DrawString("VISITAR PORTFÓLIO 3D ↗", $fontCTA, $logoBrush, 118, 503)

# Domain & GitHub info beside CTA
$g.DrawString("https://michael.dev.br", $fontDomain, $lilacBrush, 450, 495)
$g.DrawString("GitHub: @Lettify   ·   Acesse online", $fontMeta, $dimBrush, 450, 523)

# Save as og-cover.png and og-image.png
$destCover = "public/og-cover.png"
$destImage = "public/og-image.png"
$bmp.Save($destCover, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($destImage, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
"Generated $destCover and $destImage successfully."
