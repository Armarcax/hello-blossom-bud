# HAYQ AI Prediction Module

Machine Learning մոդուլ HAYQ token-ի գնի կանխատեսման համար:

## Ֆայլեր

- **predict.py** - Կանխատեսման մոդել և CLI ինտերֆեյս
- **train_model.py** - ML մոդելի վարժեցում
- **saved_model/** - Վարժված մոդելների պահեստ

## Տեղադրում

\`\`\`bash
cd ai
pip install pandas scikit-learn joblib numpy
\`\`\`

## Օգտագործում

### Վարժեցնել մոդելը

\`\`\`bash
python train_model.py
\`\`\`

### Կատարել կանխատեսում

\`\`\`bash
python predict.py
\`\`\`

### Python կոդում

\`\`\`python
from ai.predict import predictor_instance

data = {
    "volume": 12345,
    "transactions": 234,
    "growth_rate": 0.07
}

predicted_price = predictor_instance.predict(data)
print(f"Կանխատեսված գին: {predicted_price}")
\`\`\`

## Ինտեգրացիա Bot-ի հետ

Bot-ը ավտոմատ օգտագործում է այս մոդուլը գնի կանխատեսման համար:

\`\`\`python
from ai.predict import predictor_instance

# Bot-ի trader loop-ում
prediction = predictor_instance.predict(market_data)
\`\`\`

## Մոդելի Ճարտարապետություն

- **Ալգորիթմ**: Random Forest Regressor
- **Features**: volume, transactions, growth_rate
- **Target**: target_price

## Նշումներ

- Մոդելը պահվում է `saved_model/hayq_model.pkl` ֆայլում
- Կարող եք փոխարինել ավելի բարդ մոդելներով (LSTM, Transformer, etc.)
- Ներկայիս իրականացումը օրինակելի է և պետք է թարմացվի իրական տվյալներով
