# Rate Limit Converter

A simple and intuitive web tool to convert rate limits between different time units and formats. Perfect for developers working with APIs, backend systems, and understanding rate limiting configurations.

## 🚀 Features

- **Multiple Time Unit Conversions**: Convert between seconds, minutes, hours, and days
- **Real-time Calculations**: Instant conversion as you type
- **Clean Interface**: Simple, user-friendly design
- **Bidirectional Conversion**: Convert from any unit to any other unit
- **API Developer Friendly**: Understand rate limits quickly when reading API documentation

## 🎯 Use Cases

- **API Integration**: Quickly understand rate limits when integrating third-party APIs
- **Backend Development**: Calculate appropriate rate limits for your own APIs
- **DevOps**: Configure rate limiting in nginx, HAProxy, or cloud services
- **Documentation**: Convert rate limits to user-friendly formats for API documentation

## 📊 Example Conversions

| Input | Output Examples |
|-------|----------------|
| 100 requests/second | 6,000 req/min • 360,000 req/hour • 8,640,000 req/day |
| 5,000 requests/hour | 83.33 req/min • 1.39 req/sec • 120,000 req/day |
| 1,000 requests/day | 41.67 req/hour • 0.69 req/min • 0.012 req/sec |

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling
- **JavaScript** - Conversion logic
- **Responsive Design** - Works on all devices

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/GouthamAdepu/Rate-limit-converter.git
```

2. Navigate to the project directory:
```bash
cd Rate-limit-converter
```

3. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

4. Visit `http://localhost:8000` in your browser

## 📱 Usage

1. Enter the number of requests in the input field
2. Select the time unit (seconds, minutes, hours, or days)
3. View conversions to all other time units instantly
4. Copy the values you need for your configuration

## 🌐 Live Demo

Visit the live application: [Rate Limit Converter](https://your-vercel-deployment.vercel.app)

## 📂 Project Structure

```
Rate-limit-converter/
├── index.html          # Main HTML file
├── style.css           # Styling
├── script.js           # Conversion logic
├── README.md           # Documentation
└── assets/             # Images and resources
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

## 📝 Conversion Formulas

The tool uses these conversion factors:

- **1 second** = 1/60 minute = 1/3600 hour = 1/86400 day
- **1 minute** = 60 seconds = 1/60 hour = 1/1440 day
- **1 hour** = 3600 seconds = 60 minutes = 1/24 day
- **1 day** = 86400 seconds = 1440 minutes = 24 hours

## 🐛 Known Issues

None at the moment. Please report any bugs by opening an issue.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Goutham Adepu**

- GitHub: [@GouthamAdepu](https://github.com/GouthamAdepu)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

## 📞 Contact

- Gmail: adepugouthamsribhargav@gmail.com

For questions or suggestions, feel free to reach out or open an issue on GitHub.

---

Made with ❤️ by Goutham Adepu
