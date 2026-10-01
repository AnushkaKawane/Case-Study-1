import pandas as pd

# ==============================
# 1. Load dataset
# ==============================

df = pd.read_csv("backend/heart.csv")

print("Original dataset")
print("----------------")
print("Rows:", df.shape[0])
print("Columns:", df.shape[1])

# ==============================
# 2. Check missing values
# ==============================

print("\nMissing values:")
print(df.isnull().sum())

# ==============================
# 3. Check duplicate rows
# ==============================

duplicates = df.duplicated().sum()

print("\nDuplicate rows:", duplicates)

# Remove duplicate rows
df = df.drop_duplicates()

print("Rows after removing duplicates:", len(df))

# ==============================
# 4. Check data types
# ==============================

print("\nData types:")
print(df.dtypes)

# ==============================
# 5. Check invalid values
# ==============================

print("\nUnique values:")

for column in df.columns:
    print(column, ":", sorted(df[column].unique()))

# ==============================
# 6. Remove completely empty rows
# ==============================

df = df.dropna(how="all")

# ==============================
# 7. Reset index
# ==============================

df = df.reset_index(drop=True)

# ==============================
# 8. Save cleaned dataset
# ==============================

df.to_csv(
    "backend/heart_cleaned.csv",
    index=False
)

# ==============================
# 9. Final information
# ==============================

print("\n==============================")
print("CLEANING COMPLETED")
print("==============================")

print("Original rows:", 1025)
print("Duplicates removed:", duplicates)
print("Final rows:", len(df))
print("Columns:", len(df.columns))

print("\nCleaned dataset saved to:")
print("backend/heart_cleaned.csv")