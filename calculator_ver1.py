import psycopg2

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="single_course",
    user="jerrydbz",
    password=""
)

cur = conn.cursor()

course_codes = ['MATH145', 'CHEM240']

sql = """
SELECT code, units
FROM public.courses
WHERE code IN %s
ORDER BY code
"""

cur.execute(sql, (tuple(course_codes),))
rows = cur.fetchall()

total_units = 0
print("Course List:")
for code, units in rows:
    print(f"{code}: {units} units")
    total_units += units

print(f"\nTotal Units: {total_units}")

cur.close()
conn.close()