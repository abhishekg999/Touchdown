import json 
import sys

sys.setrecursionlimit(10000)

def teammate_bfs_all(graph, start, goal):
	explored = []
	queue = [[start]]

	found = False

	to_ret = []
	 
	if start == goal:
		return [start]
	 
	while queue:
		path = queue.pop(0)
		node = path[-1]
		 
		if node not in explored:
			neighbours = graph[node]

		
			for neighbour in neighbours:
				new_path = list(path)
				new_path.append(neighbour)

				if not found:
					queue.append(new_path)

				if neighbour == goal:
					to_ret.append([x for x in new_path])
					found = True
					#return new_path
			
			explored.append(node)


	return to_ret
	#return None

def teammate_bfs(graph, start, goal, pop_only=False):
	explored = []
	queue = [[start]]

	found = False

	to_ret = []
	 
	if start == goal:
		return [start]
	 
	while queue:
		path = queue.pop(0)
		node = path[-1]
		 
		if node not in explored:
			neighbours = graph[node]
			for neighbour in neighbours:
				new_path = list(path)
				new_path.append(neighbour)
				queue.append(new_path)
				if neighbour == goal:
					to_ret.append([[x for x in new_path]])
					return new_path
			
			explored.append(node)
	return None


teammates = json.load(open('player_teammates.json'))
teammates = {int(k) : v for k, v in teammates.items()}

id_to_player = json.load(open('player_lookup_table.json'))
id_to_player = {int(k) : v for k, v in id_to_player.items()}
player_to_id = {v: k for k, v in id_to_player.items()}


popular_players = [2214, 3045, 10193, 5952, 11201, 2532, 4088, 8456, 71, 10357, 8713, 6269, 7567, 11353, 8115, 2801, 5644, 10564, 6304, 5609, 10016, 8059, 6056, 2512, 2512, 1923, 3117, 6437, 11173, 344, 6261, 333, 7944, 703, 6095, 55, 9637, 7227, 10343, 2485, 6957, 6386, 2476, 9834, 3994, 118, 9422, 2522, 3, 6940, 1683, 7871, 4660, 1081, 8347, 4495, 7033, 7791, 10012, 8123, 4965, 8228, 4490, 3311, 5237, 4408, 2958, 7681, 1531, 11152, 11591, 2252, 7926, 3420, 5081, 10481, 1535, 3089, 11165, 5507, 1867, 6971, 2353, 10229, 2353, 6971, 312, 4907, 6612, 3978, 8044, 3353, 3217, 9737, 6201, 1083, 4275, 3976, 7991, 10846, 3778, 8543, 11578, 7722, 6848, 2553, 11, 4116, 8240, 9415, 25, 3780, 705, 9555, 6651, 6578, 7830, 9820, 2268, 2758, 2069, 8435, 4636, 7193, 2444, 2964, 11428, 6178, 8972, 7460, 9348, 1813, 8996, 1397, 9068, 1495, 759, 10143, 6342, 309, 4850, 2773, 2157, 7916, 586, 11031, 11270, 2433, 4140, 1995, 11001, 5514, 9171, 8817, 781, 9092, 1239, 10735, 5739, 2609, 3122, 6998, 9016, 11075, 10295, 3710, 6914, 8010, 8057, 7103, 9325, 425];
#all_paths = all_teammate_paths(11185, 3584)
#print(all_paths)


if len(sys.argv) != 3:
	print("Wrong parameters provided. Exiting.")
	sys.exit(1)


player_start = int(sys.argv[1])
player_end = int(sys.argv[2])

shortest_path = teammate_bfs(teammates, player_start, player_end)

print(shortest_path)
name_route = [id_to_player[pid] for pid in shortest_path]

print(" -> ".join(name_route))