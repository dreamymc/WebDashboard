with open('components/DataProvider.tsx', 'r') as f:
    content = f.read()

content = content.replace("  transport,\n} from", "  transport,\n  locationDirectory,\n} from")
content = content.replace("    transport: tr,", "    transport: tr,\n    locationDirectory: locationDirectory(rows),")

with open('components/DataProvider.tsx', 'w') as f:
    f.write(content)
