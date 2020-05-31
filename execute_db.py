#!/usr/bin/python
import MySQLdb
import argparse

QUERIES = {
    "GET_IP": "SELECT * FROM covid_ip",
    "GET_QUESTION_STATS": "SELECT * FROM covid",
    "INSERT_IP": "INSERT INTO covid_ip(ip) VALUES",
    "INSERT_STATS": "INSERT INTO covid(quest_no, total_count, correct_count) VALUES"
}

def insert_ip(db, cursor, values):
    query = QUERIES["INSERT_IP"] + "(\"" + values[0] + "\")"
    try:
        # TODO: Add IP address validation
        cursor.execute(query)
        db.commit()
    except Exception as e:
        print(str(e))
        db.rollback()

def insert_stats(db, cursor, values):
    query = QUERIES["INSERT_STATS"]  + str(tuple(values))
    try:
        cursor.execute(query)
        db.commit()
    except Exception as e:
        print(str(e))
        db.rollback()

def update_stats(db, cursor, values):
    query = "UPDATE covid SET total_count=" + values[1] + ",\
            correct_count=" + values[2] + " WHERE quest_no=" + values[0]

    print(query)
    try:
        cursor.execute(query)
        db.commit()
    except Exception as e:
        print(str(e))
        db.rollback()

def get_ip_table(cursor):
    query = QUERIES["GET_IP"]
    cursor.execute(query)
    result = cursor.fetchall()
    result = [x[0] for x in result]
    return result

def get_question_stats_table(cursor):
    query = QUERIES["GET_QUESTION_STATS"]
    cursor.execute(query)
    result = cursor.fetchall()
    result_dict = {}
    for x in result:
        result_dict[str(x[0])] = [x[1], x[2]]
    return result_dict

def run():
    parser = argparse.ArgumentParser(description="MySQLdb service")
    parser.add_argument("-op", "--operation", type=str, required=True)
    parser.add_argument("-val", "--value", type=str, nargs="*", default="")
    args = parser.parse_args()

    db = MySQLdb.connect("bharidata.cu2xv9ssgoyq.us-east-2.rds.amazonaws.com",
            "admin", "liverpool123", "coviz")
    cursor = db.cursor()
    
    if args.operation:
        op = args.operation
        if op == "insert":
            if args.value:
                if len(args.value) == 1:
                    insert_ip(db, cursor, args.value)
                elif len(args.value) == 3:
                    insert_stats(db, cursor, args.value)
                else:
                    raise Exception("Invalid command")
            else:
                raise Exception("Invalid command")

        elif op == "update":
            if args.value:
                update_stats(db, cursor, args.value)
            else:
                raise Exception("Invalid command")

        elif op == "get":
            if args.value:
                raise Exception("Invalid command")

            else:
                result = {}
                result["stats"] = get_question_stats_table(cursor)
                result["ip"] = get_ip_table(cursor)
                print(result)
    db.close()

if __name__ == "__main__":
    run()
